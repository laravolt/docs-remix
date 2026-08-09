import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc'

// @markdoc/markdoc ships CJS; named runtime exports are not visible to Node ESM.
const { Tag } = Markdoc
import { createElement } from 'remix/ui'
import type { RemixNode } from 'remix/ui'

import { Callout } from './callout.tsx'
import { Fence } from './fence.tsx'
import { Figure } from './figure.tsx'
import { IFrame } from './iframe.tsx'
import { QuickLink, QuickLinks } from './quick-links.tsx'

const components: Record<string, any> = {
  Callout,
  Fence,
  Figure,
  IFrame,
  QuickLink,
  QuickLinks,
}

/** Convert a transformed Markdoc tree into Remix virtual elements. */
export function renderMarkdoc(node: RenderableTreeNode): RemixNode {
  if (node == null || typeof node === 'boolean') return null
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map((child) => renderMarkdoc(child))
  if (!Tag.isTag(node)) return null

  let { name, attributes = {}, children = [] } = node
  let type = components[name] ?? name
  let { class: className, ...rest } = attributes

  let props: Record<string, any> = { ...rest }
  if (className) props.className = className

  return createElement(type, props, ...children.map((child) => renderMarkdoc(child)))
}
