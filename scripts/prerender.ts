/**
 * Prerender the docs site to static files in `dist/` for deployment as
 * Cloudflare Workers static assets.
 *
 * Steps:
 * 1. Start the production server on an ephemeral port.
 * 2. Enumerate every route from `content/` (v7 lives at the URL root,
 *    legacy versions keep their `/v6/...` prefix).
 * 3. Fetch each HTML page + its `.md` mirror + `llms.txt` / `llms-full.txt`.
 * 4. Download every `/assets/*` file referenced by the rendered HTML.
 * 5. Copy `public/` into `dist/` and emit `_redirects` for old `/v7/*` URLs and
 *    `_headers` so `.ts` modules are served as JavaScript.
 */
import { spawn } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

const root = path.dirname(import.meta.dirname)
const contentDir = path.join(root, 'content')
const distDir = path.join(root, 'dist')
const port = 44199
const base = `http://localhost:${port}`

function collectRoutes(): string[] {
  const routes: string[] = ['/']
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const abs = path.join(dir, entry.name)
      if (fs.existsSync(path.join(abs, 'page.md'))) {
        const rel = `/${path.relative(contentDir, abs).split(path.sep).join('/')}`
        // v7 is served from the URL root; legacy versions keep their prefix.
        routes.push(rel.startsWith('/v7/') ? rel.slice('/v7'.length) : rel)
      }
      walk(abs)
    }
  }
  walk(contentDir)
  return [...new Set(routes)].sort()
}

async function waitForServer(): Promise<void> {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`${base}/`, { redirect: 'manual' })
      if (res.status < 500) return
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('Server did not start in time')
}

function writeFile(rel: string, body: Buffer | string) {
  const abs = path.join(distDir, rel)
  fs.mkdirSync(path.dirname(abs), { recursive: true })
  fs.writeFileSync(abs, body)
}

async function fetchOk(url: string): Promise<Response> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} for ${url}`)
  return res
}

function copyDir(from: string, to: string) {
  fs.cpSync(from, to, { recursive: true })
}

async function main() {
  fs.rmSync(distDir, { recursive: true, force: true })
  fs.mkdirSync(distDir, { recursive: true })

  const server = spawn('node', ['--import', 'remix/node-tsx', 'server.ts'], {
    cwd: root,
    env: { ...process.env, NODE_ENV: 'production', PORT: String(port) },
    stdio: 'ignore',
  })

  try {
    await waitForServer()

    const routes = collectRoutes()
    const assetUrls = new Set<string>()

    for (const route of routes) {
      const html = await (await fetchOk(`${base}${route}`)).text()
      writeFile(route === '/' ? 'index.html' : `${route}/index.html`, html)

      for (const match of html.matchAll(/["'](\/assets\/[^"']+)["']/g)) {
        assetUrls.add(match[1])
      }

      // `.md` mirror for every docs page (used by LLM/agent consumers).
      // The homepage's mirror is /index.md, the URL its "Copy Markdown" button uses.
      const mirrorPath = route === '/' ? '/index.md' : `${route}.md`
      const mirror = await fetch(`${base}${mirrorPath}`)
      if (mirror.ok) writeFile(mirrorPath, await mirror.text())
    }

    writeFile('llms.txt', await (await fetchOk(`${base}/llms.txt`)).text())
    writeFile('llms-full.txt', await (await fetchOk(`${base}/llms-full.txt`)).text())

    // The HTML only names the entry module; follow its static and dynamic
    // imports so every module it loads is exported too.
    const queue = [...assetUrls]
    while (queue.length > 0) {
      const assetUrl = queue.shift() as string
      const res = await fetchOk(`${base}${assetUrl}`)
      const body = Buffer.from(await res.arrayBuffer())
      // Import URLs keep percent-encoding (`%40remix-run`). Write the decoded
      // path the asset server looks up, and the literal one as a fallback.
      writeFile(decodeURIComponent(assetUrl), body)
      if (decodeURIComponent(assetUrl) !== assetUrl) writeFile(assetUrl, body)

      if (/\.(m?js|tsx?)$/.test(assetUrl)) {
        for (const match of body.toString('utf8').matchAll(/(?:from|import)\s*\(?\s*["'](\/assets\/[^"']+)["']/g)) {
          if (!assetUrls.has(match[1])) {
            assetUrls.add(match[1])
            queue.push(match[1])
          }
        }
      }
    }

    copyDir(path.join(root, 'public'), distDir)

    // Old /v7-prefixed URLs permanently redirect to the root equivalents.
    writeFile('_redirects', ['/v7 / 301', '/v7/* /:splat 301', ''].join('\n'))

    // Modules keep their source extension (.ts). Cloudflare would serve those
    // as video/mp2t, and browsers refuse to run a module with that MIME type.
    writeFile(
      '_headers',
      ['/assets/*.ts', '  Content-Type: text/javascript; charset=utf-8', '/assets/*.tsx', '  Content-Type: text/javascript; charset=utf-8', ''].join('\n'),
    )

    writeFile(
      '404.html',
      '<!doctype html><meta charset="utf-8"><title>Not Found</title>' +
        '<p>Page not found. <a href="/">Back to the Laravolt docs</a>.</p>',
    )

    console.log(`Prerendered ${routes.length} pages + ${assetUrls.size} assets into dist/`)
  } finally {
    server.kill('SIGTERM')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
