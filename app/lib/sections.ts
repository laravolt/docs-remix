import type { Node } from '@markdoc/markdoc'

import { slugifyWithCounter } from './slugify.ts'

export type Subsection = {
  id: string
  title: string
  children?: undefined
}

export type Section = {
  id: string
  title: string
  children: Array<Subsection>
}

function getNodeText(node: Node): string {
  let text = ''
  for (let child of node.children ?? []) {
    if (child.type === 'text') {
      text += child.attributes.content
    }
    text += getNodeText(child)
  }
  return text
}

export function collectSections(
  nodes: Array<Node>,
  slugify = slugifyWithCounter(),
): Array<Section> {
  let sections: Array<Section> = []

  for (let node of nodes) {
    if (node.type === 'heading' && (node.attributes.level === 2 || node.attributes.level === 3)) {
      let title = getNodeText(node)
      if (title) {
        let id = typeof node.attributes.id === 'string' ? node.attributes.id : slugify(title)
        if (node.attributes.level === 3) {
          if (sections[sections.length - 1]) {
            sections[sections.length - 1].children.push({ id, title })
          }
        } else {
          sections.push({ id, title, children: [] })
        }
      }
    }

    sections.push(...collectSections(node.children ?? [], slugify))
  }

  return sections
}
