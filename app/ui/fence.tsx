import type { Handle } from 'remix/ui'

import { highlight } from '../lib/highlight.ts'

const languageNames: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  tsx: 'TSX',
  html: 'HTML',
  css: 'CSS',
  php: 'PHP',
  bash: 'Bash',
  shell: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'Markdown',
  md: 'Markdown',
  sql: 'SQL',
  txt: 'Plain Text',
  text: 'Plain Text',
  blade: 'Blade',
  env: '.env',
  dotenv: '.env',
}

/**
 * Server-rendered code block. Prism highlights it at render time, so the
 * prerendered HTML already carries the token spans that `prism.css` colors.
 * The copy button is wired by `app/assets/code-copy.ts`.
 */
export function Fence(handle: Handle<{ content?: string; language?: string; children?: any }>) {
  return () => {
    let { content, language = 'txt', children } = handle.props
    let code = (content ?? (typeof children === 'string' ? children : '')).replace(/\n+$/, '')
    let displayLanguage =
      languageNames[language] ||
      (language ? language.charAt(0).toUpperCase() + language.slice(1) : 'Plain Text')
    let highlighted = highlight(code, language)

    return (
      <div className="group relative">
        <div className="absolute top-2 left-4 rounded py-1.5 font-mono text-xs text-gray-500">
          {displayLanguage}
        </div>
        <button
          type="button"
          data-code-copy
          aria-label="Copy code"
          className="absolute top-2 right-2 rounded-md border border-slate-600/60 bg-slate-800/80 px-2 py-1 font-sans text-xs text-slate-300 opacity-70 transition hover:text-white hover:opacity-100 focus-visible:opacity-100"
        >
          Copy
        </button>
        <pre
          className={`language-${language}`}
          style="padding: 1rem; border-radius: 0.5rem; padding-top: 2.5rem;"
        >
          {highlighted === null ? (
            <code className={`language-${language}`}>{code}</code>
          ) : (
            <code className={`language-${language}`} innerHTML={highlighted} />
          )}
        </pre>
      </div>
    )
  }
}
