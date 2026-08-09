import * as fs from 'node:fs'
import * as path from 'node:path'

import Markdoc, { type Config, type RenderableTreeNode } from '@markdoc/markdoc'

// @markdoc/markdoc ships CJS; named runtime exports are not visible to Node ESM.
const { Tag } = Markdoc
import yaml from 'js-yaml'

import { collectSections, type Section } from './sections.ts'
import { slugifyWithCounter } from './slugify.ts'

export interface PageFrontmatter {
  title?: string
  description?: string
  [key: string]: unknown
}

export interface RenderedPage {
  frontmatter: PageFrontmatter
  content: RenderableTreeNode
  tableOfContents: Array<Section>
}

const contentDir = path.join(process.cwd(), 'content')

/** Map a URL pathname to its markdown source file, or null when it does not exist. */
export function contentFileForPath(pathname: string): string | null {
  let clean = pathname.replace(/\/+$/, '')
  if (clean.includes('..')) return null

  // v7 is the current version and lives at the URL root (`/introduction` →
  // `content/v7/introduction`). Only legacy versions keep a URL prefix
  // (`/v6/...` → `content/v6/...`). The homepage stays at `content/page.md`.
  if (clean !== '' && !clean.startsWith('/v6')) {
    clean = `/v7${clean}`
  }

  let file = path.join(contentDir, clean, 'page.md')
  if (!file.startsWith(contentDir)) return null

  return fs.existsSync(file) ? file : null
}

function buildConfig(slugify: ReturnType<typeof slugifyWithCounter>): Config {
  return {
    nodes: {
      heading: {
        ...Markdoc.nodes.heading,
        transform(node, config) {
          let attributes = node.transformAttributes(config)
          let children = node.transformChildren(config)
          let text = children.filter((child) => typeof child === 'string').join(' ')
          let id = attributes.id ?? slugify(text)

          return new Tag(`h${node.attributes.level}`, { ...attributes, id }, children)
        },
      },
      th: {
        ...Markdoc.nodes.th,
        attributes: {
          ...Markdoc.nodes.th.attributes,
          scope: { type: String, default: 'col' },
        },
      },
      fence: {
        render: 'Fence',
        attributes: {
          content: { type: String },
          language: { type: String },
        },
      },
    },
    tags: {
      callout: {
        attributes: {
          title: { type: String },
          type: {
            type: String,
            default: 'note',
            matches: ['note', 'warning'],
            errorLevel: 'critical',
          },
        },
        render: 'Callout',
      },
      figure: {
        selfClosing: true,
        attributes: {
          src: { type: String },
          alt: { type: String },
          caption: { type: String },
        },
        render: 'Figure',
      },
      'quick-links': {
        render: 'QuickLinks',
      },
      'quick-link': {
        selfClosing: true,
        render: 'QuickLink',
        attributes: {
          title: { type: String },
          description: { type: String },
          icon: { type: String },
          href: { type: String },
        },
      },
      iframe: {
        render: 'IFrame',
        attributes: {
          src: { type: String },
          title: { type: String },
          width: { type: String },
          height: { type: String },
        },
      },
    },
  }
}

export function renderPageFile(file: string): RenderedPage {
  let source = fs.readFileSync(file, 'utf8')
  let ast = Markdoc.parse(source)

  let frontmatter: PageFrontmatter = {}
  if (ast.attributes.frontmatter) {
    let parsed = yaml.load(ast.attributes.frontmatter)
    if (parsed && typeof parsed === 'object') {
      frontmatter = parsed as PageFrontmatter
    }
  }

  // DocsHeader renders the frontmatter title as the page <h1>, so drop the
  // first level-1 heading from the content to avoid a duplicate h1.
  let firstH1 = ast.children.findIndex(
    (node) => node.type === 'heading' && node.attributes.level === 1,
  )
  if (firstH1 !== -1) {
    ast.children.splice(firstH1, 1)
  }

  let tableOfContents = collectSections(ast.children)

  let content = Markdoc.transform(ast, buildConfig(slugifyWithCounter()))

  return { frontmatter, content, tableOfContents }
}

/** Read only the frontmatter of a page file (no transform). */
export function readPageFrontmatter(file: string): PageFrontmatter {
  let source = fs.readFileSync(file, 'utf8')
  let ast = Markdoc.parse(source)
  if (ast.attributes.frontmatter) {
    let parsed = yaml.load(ast.attributes.frontmatter)
    if (parsed && typeof parsed === 'object') return parsed as PageFrontmatter
  }
  return {}
}

/** Raw Markdoc source for a URL pathname, or null when the page does not exist. */
export function rawPageSource(pathname: string): string | null {
  let file = contentFileForPath(pathname)
  if (!file) return null
  return fs.readFileSync(file, 'utf8')
}
