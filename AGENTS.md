# Laravolt Docs Agent Guide

Documentation site for Laravolt, live at **https://laravolt.dev**. Remix v3 +
Markdoc, prerendered to static files and served from Cloudflare Workers.
Originally a Next.js 15 + Markdoc build on the Tailwind Plus "Syntax" template.

**This directory is the canonical repo** (`laravolt/docs-remix`, branch `main`).
A second clone used to exist at `~/orca/projects/laravolt-docs-remix` and held the
entire deploy pipeline as uncommitted changes — production ran code that was in no
git repo at all. It was merged in and deleted on 2026-08-09. Do all work here and
do not create a second clone.

## Commands

```sh
npm i
npm run dev        # dev server on :44120, --watch
npm run typecheck  # tsc --noEmit
npm run css        # Tailwind CLI -> public/styles.css
npm run build      # css + prerender -> dist/
npm run deploy     # build, then wrangler deploy to laravolt.dev
```

**nvm breaks in non-interactive shells** — `node`/`npm` resolve to a zsh lazy-load
function that floods output with `_nvm_lazy_load: command not found` and fails.
Call the binaries by absolute path instead:

```sh
N=$HOME/.nvm/versions/node/v22.22.2/bin
"$N/node" node_modules/.bin/tsc --noEmit     # local bins: run via node
"$N/node" "$N/npm" install                   # npm: both by absolute path
PATH="$N:$PATH" "$N/node" --import remix/node-tsx scripts/prerender.ts
```

That last one needs `PATH` set because the prerender script `spawn`s a bare `node`
for its own server. Kill a stuck dev server with
`lsof -tnP -iTCP:44120 -sTCP:LISTEN | xargs kill`.

## Building features

Read `.agents/skills/remix/SKILL.md` first. **Remix 3 has no React and no hooks.**
Components are `function X(handle: Handle<Props>)` returning a render function;
everything imports from the single `remix` package via subpaths.

## Layout

- `app/routes.ts` — route contract; `app/router.ts` wires routes to handlers
- `app/actions/controller.tsx` — top-level route actions, `/v7/*` redirects, `.md` mirrors
- `app/middleware/render.tsx` — request-scoped renderer
- `app/lib/markdoc.ts` — maps a URL to a content file, then parses/transforms it at request time
- `app/lib/navigation.ts` — sidebar tree + version list; **add new pages here**
- `app/lib/llms.ts` — `llms.txt` / `llms-full.txt` / per-page `.md` mirrors
- `app/ui/markdoc.tsx` — renders the Markdoc tree to Remix elements (fence, callout, quick-links…)
- `app/ui/` — document shell, layout/header/nav, docs layout, prose styles
- `app/assets/entry.ts` + `theme.ts` — client entry and dark mode
- `content/` — 70 `page.md` sources: 1 home + 42 under `v7/` + 27 under `v6/`
- `scripts/prerender.ts` — static export (its own server on :44199)
- `public/` — static files; `public/styles.css` is generated, but **is committed**

## URLs

The current version (v7) is served from the URL **root** — `/getting-started/installation`,
not `/v7/getting-started/installation`. Only legacy versions keep a prefix (`/v6/...`).

- `app/lib/markdoc.ts` prepends `/v7` to anything that is not `/v6*` when resolving
  a request, so `content/v7/` stays where it is on disk.
- `app/actions/controller.tsx` 301-redirects leftover `/v7/*` URLs (including `.md`
  mirrors); `scripts/prerender.ts` writes the same rules to `dist/_redirects`.
- v7 nav hrefs in `app/lib/navigation.ts` are unprefixed (`pathPrefix: ''`).

When adding a v7 page, link to it **without** the version prefix.

## Content rules

- Never hand-convert markdown to JSX. Add or edit `content/**/page.md`, then add the
  link to `app/lib/navigation.ts` — routes derive from the content tree.
- `@markdoc/markdoc` is CJS: under Node ESM only the default export carries runtime
  values. Import `Markdoc` default and destructure (`const { Tag } = Markdoc`);
  named imports are fine for types only.

## Branding

The Syntax template ships sky/cyan accents; Laravolt's identity is the purple bolt
from the legacy Jigsaw docs (`laravolt/laravolt.github.io`).

- Use the `brand-*` scale in `app/styles/tailwind.css` for every accent.
  **Never reintroduce `sky-*`/`cyan-*`.** `brand-500` (`#b263d1`) and `brand-800`
  (`#462eb4`) are sampled from the logo gradient; the rest is OKLCH-interpolated.
- Contrast: on white use `brand-600`/`brand-700` for text; on `slate-900` use
  `brand-300`/`brand-400`. `brand-500` only clears AA-large on white.
- `Logomark` in `app/ui/layout.tsx` is the logo, inlined as SVG with the bolt traced
  from the original `logo.png`. The wordmark beside it is plain HTML text so it
  inherits the site font and dark-mode color.
- Tailwind v4 tree-shakes unused theme tokens, so `brand-500`/`brand-950` are absent
  from the built CSS. That is expected, not a build failure.

## Deploy

Production is the Cloudflare Worker `laravolt-docs` (custom domain `laravolt.dev`)
serving **prerendered static assets**. `server.ts` only runs locally and during
prerender — it is never deployed.

```sh
npm run deploy     # or: npm run build && wrangler deploy
```

`dist/` is generated and gitignored — never edit it by hand. `wrangler.jsonc` points
at `./dist` with `html_handling: auto-trailing-slash` (so `/x` 307s to `/x/` — normal,
not a bug) and `not_found_handling: 404-page`.

Verify a deploy — **the CDN will lie to you**, a path you visited recently keeps
serving the old HTML:

```sh
curl -s "https://laravolt.dev/styles.css?cb=$RANDOM" | shasum   # compare to dist/
curl -sL "https://laravolt.dev/some/page/?cb=$RANDOM" | grep brand-
```

Comparing a production asset's `shasum` against `dist/` is the strongest proof.
Fresh 404s in the first ~15s after upload are edge propagation — retest before
debugging config.

## Tooling gotchas

- **RTK filters git output.** `git diff > patch.diff` writes a human-readable summary,
  not a unified diff, and `git apply` rejects it with `error: No valid patches in
  input`. Use `rtk proxy git ...` whenever output is piped to another tool or a file.
- `git -C <dir>` beats `cd` — the shell's cwd persists across Bash calls and it is
  easy to run a command in the wrong repo.

## Known issues

- Inline code inside **table cells** renders literal backticks (see the Requirements
  table on `/getting-started/installation`). Markdoc pipeline bug, pre-existing.
- `public/images/blur-cyan.png` and `blur-indigo.png` (~430 KB) are unreferenced
  leftovers from the template's palette.
- The preview URL `laravolt-docs.personal-project.workers.dev` still serves the site
  and should be redirected to `laravolt.dev` to avoid duplicate content.

## References

- `docs/MIGRATION-NEXTJS-TO-REMIX-V3-SYNTAX.md` — full migration log
- Knowledge base: `~/orca/projects/brain` — `wiki/projects/laravolt.md`,
  `wiki/lessons/2026-08-09-laravolt-docs-remix-migration-deploy.md`,
  `wiki/lessons/2026-08-09-production-from-uncommitted-working-copy.md`
