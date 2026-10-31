import { run } from 'remix/ui'

import { initCodeCopy } from './code-copy.ts'
import { initLlmsActions } from './llms-copy.ts'
import { initTheme } from './theme.ts'

run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(moduleUrl)
    return mod[exportName]
  },
  async resolveFrame(src, signal) {
    let response = await fetch(src, { headers: { Accept: 'text/html' }, signal })
    if (!response.ok) {
      return `<pre>Frame error: ${response.status} ${response.statusText}</pre>`
    }

    if (response.body) return response.body
    return await response.text()
  },
})

initTheme()
initLlmsActions()
initCodeCopy()
