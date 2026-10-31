import { createRequire } from 'node:module'

import Prism from 'prismjs'

// Prism's language files register themselves on the global Prism instance
// and are CommonJS, so load them through require. Order matters: php needs
// markup-templating, which needs markup (part of core).
const require = createRequire(import.meta.url)
for (let language of [
  'markup-templating',
  'php',
  'bash',
  'json',
  'yaml',
  'sql',
  'typescript',
  'jsx',
  'http',
]) {
  require(`prismjs/components/prism-${language}.js`)
}

/** Fence languages that are written under another name in the docs. */
const aliases: Record<string, string> = {
  blade: 'markup',
  html: 'markup',
  shell: 'bash',
  sh: 'bash',
  env: 'bash',
  dotenv: 'bash',
  yml: 'yaml',
  ts: 'typescript',
}

/**
 * Highlight `code` at render time. Returns HTML with Prism token spans,
 * or null when the language has no grammar (the caller renders plain text).
 */
export function highlight(code: string, language: string): string | null {
  let name = aliases[language] ?? language
  let grammar = Prism.languages[name]
  if (!grammar) return null

  return Prism.highlight(code, grammar, name)
}
