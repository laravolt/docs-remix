import type { Handle } from 'remix/ui'

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
}

/**
 * Server-rendered code block. Simplification vs the Next.js template:
 * no prism-react-renderer runtime highlighting and no copy button —
 * static `prism.css` styles the block, `language-*` classes are preserved.
 */
export function Fence(handle: Handle<{ content?: string; language?: string; children?: any }>) {
  return () => {
    let { content, language = 'txt', children } = handle.props
    let code = (content ?? (typeof children === 'string' ? children : '')).replace(/\n+$/, '')
    let displayLanguage =
      languageNames[language] ||
      (language ? language.charAt(0).toUpperCase() + language.slice(1) : 'Plain Text')

    return (
      <div className="group relative">
        <div className="absolute top-2 left-4 rounded py-1.5 font-mono text-xs text-gray-500">
          {displayLanguage}
        </div>
        <pre
          className={`language-${language}`}
          style="padding: 1rem; border-radius: 0.5rem; padding-top: 2.5rem;"
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    )
  }
}
