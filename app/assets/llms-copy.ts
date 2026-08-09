/**
 * Wires the "Copy Markdown" action row rendered by DocsHeader.
 *
 * The container carries `data-llms-actions="<mirror path>"`; inside it:
 * - [data-llms-copy]            fetches the `.md` mirror and copies it
 * - [data-llms-open="chatgpt"]  link to ChatGPT with a prompt pointing at the mirror URL
 * - [data-llms-open="claude"]   link to Claude with the same prompt
 */
export function initLlmsActions() {
  let container = document.querySelector<HTMLElement>('[data-llms-actions]')
  if (!container) return

  let mirrorPath = container.dataset.llmsActions
  if (!mirrorPath) return

  let mirrorUrl = new URL(mirrorPath, window.location.origin).href
  let prompt = `Read ${mirrorUrl} and help me understand, summarize, and answer questions about the content.`

  for (let link of container.querySelectorAll<HTMLAnchorElement>('[data-llms-open]')) {
    let base =
      link.dataset.llmsOpen === 'claude'
        ? 'https://claude.ai/new?q='
        : 'https://chatgpt.com/?q='
    link.href = base + encodeURIComponent(prompt)
  }

  let copyButton = container.querySelector<HTMLButtonElement>('[data-llms-copy]')
  let copyLabel = container.querySelector<HTMLElement>('[data-llms-copy-label]')
  if (!copyButton) return

  let resetTimer: ReturnType<typeof setTimeout> | undefined

  let setLabel = (text: string) => {
    if (copyLabel) copyLabel.textContent = text
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      if (copyLabel) copyLabel.textContent = 'Copy Markdown'
    }, 2000)
  }

  copyButton.addEventListener('click', async () => {
    try {
      let response = await fetch(mirrorPath, { headers: { Accept: 'text/markdown' } })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      await navigator.clipboard.writeText(await response.text())
      setLabel('Copied!')
    } catch {
      setLabel('Copy failed')
    }
  })
}
