import * as fs from 'node:fs'
import * as path from 'node:path'

import Markdoc, { type Config, type Node, type RenderableTreeNode } from '@markdoc/markdoc'

// @markdoc/markdoc ships CJS; named runtime exports are not visible to Node ESM.
const { Tag } = Markdoc
import { load as loadYaml } from 'js-yaml'

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
    let parsed = loadYaml(ast.attributes.frontmatter)
    if (parsed && typeof parsed === 'object') {
      frontmatter = parsed as PageFrontmatter
    }
  }

  // DocsHeader renders the frontmatter title as the page <h1>, so drop the
  // first level-1 heading from the content to avoid a duplicate h1. A page
  // without a frontmatter title uses that heading as its title instead, so it
  // still gets an <h1> and its own <title>.
  let firstH1 = ast.children.findIndex(
    (node) => node.type === 'heading' && node.attributes.level === 1,
  )
  if (firstH1 !== -1) {
    if (!frontmatter.title) frontmatter.title = plainText(ast.children[firstH1]) || undefined
    ast.children.splice(firstH1, 1)
  }

  // Pages without a frontmatter description describe themselves with their
  // opening paragraph, so search results do not all show the site default.
  if (!frontmatter.description) {
    let intro = ast.children.find((node) => node.type === 'paragraph')
    if (intro) frontmatter.description = summarize(plainText(intro)) || undefined
  }

  let tableOfContents = collectSections(ast.children)

  let content = Markdoc.transform(ast, buildConfig(slugifyWithCounter()))

  return { frontmatter, content, tableOfContents }
}

/** Text of a Markdoc node: its text and inline code, without markup. */
function plainText(node: Node): string {
  let parts: string[] = []
  for (let child of node.walk()) {
    if (child.type === 'text' || child.type === 'code') parts.push(String(child.attributes.content ?? ''))
  }
  return parts.join('').replace(/\s+/g, ' ').trim()
}

/** Cut text to at most `max` characters, at a sentence end when one fits, else a word. */
export function summarize(text: string, max = 160): string {
  if (text.length <= max) return text
  let cut = text.slice(0, max)
  let sentenceEnd = cut.lastIndexOf('. ')
  if (sentenceEnd >= 80) return cut.slice(0, sentenceEnd + 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}...`
}

/** Read only the frontmatter of a page file (no transform). */
export function readPageFrontmatter(file: string): PageFrontmatter {
  let source = fs.readFileSync(file, 'utf8')
  let ast = Markdoc.parse(source)
  if (ast.attributes.frontmatter) {
    let parsed = loadYaml(ast.attributes.frontmatter)
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
