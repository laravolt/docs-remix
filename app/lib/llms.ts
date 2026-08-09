import { contentFileForPath, rawPageSource, readPageFrontmatter } from './markdoc.ts'
import { versions } from './navigation.ts'

/** URL of the `.md` mirror for a docs pathname (`/` → `/index.md`). */
export function markdownMirrorPath(pathname: string): string {
  return pathname === '/' ? '/index.md' : `${pathname}.md`
}

/** Docs pathname a `.md` mirror URL refers to, or null when it is not a mirror URL. */
export function pathForMarkdownMirror(pathname: string): string | null {
  if (!pathname.endsWith('.md')) return null
  if (pathname === '/index.md') return '/'
  return pathname.slice(0, -'.md'.length)
}

type LlmsPage = {
  href: string
  mirror: string
  title: string
  description?: string
}

type LlmsSection = { title: string; pages: LlmsPage[] }
type LlmsVersion = { label: string; description: string; sections: LlmsSection[] }

/** Every existing docs page, grouped by version and navigation section. */
function collectVersions(): LlmsVersion[] {
  return versions.map((version) => ({
    label: `Laravolt ${version.label}`,
    description: version.description,
    sections: version.navigation
      .map((section) => ({
        title: section.title,
        pages: section.links.flatMap((link) => {
          let file = contentFileForPath(link.href)
          if (!file) return []
          let frontmatter = readPageFrontmatter(file)
          return [
            {
              href: link.href,
              mirror: markdownMirrorPath(link.href),
              title: frontmatter.title ?? link.title,
              description: frontmatter.description,
            },
          ]
        }),
      }))
      .filter((section) => section.pages.length > 0),
  }))
}

/** Build the llms.txt index (https://llmstxt.org convention). */
export function buildLlmsTxt(): string {
  let lines: string[] = [
    '# Laravolt',
    '',
    '> Laravolt is a digital empowerment platform designed to accelerate Laravel application development. This index lists every documentation page; append `.md` to any page URL to fetch its raw Markdoc source.',
    '',
  ]

  for (let version of collectVersions()) {
    for (let section of version.sections) {
      lines.push(`## ${version.label} — ${section.title}`, '')
      for (let page of section.pages) {
        let suffix = page.description ? `: ${page.description}` : ''
        lines.push(`- [${page.title}](${page.mirror})${suffix}`)
      }
      lines.push('')
    }
  }

  return lines.join('\n')
}

/** Build llms-full.txt: every page concatenated, with route headers. */
export function buildLlmsFullTxt(): string {
  let chunks: string[] = []

  for (let version of collectVersions()) {
    for (let section of version.sections) {
      for (let page of section.pages) {
        let source = rawPageSource(page.href)
        if (!source) continue
        chunks.push(`<!-- Route: ${page.href} -->\n\n${source.trim()}\n`)
      }
    }
  }

  return chunks.join('\n---\n\n')
}
