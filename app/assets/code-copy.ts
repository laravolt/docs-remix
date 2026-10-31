/**
 * Wires the Copy button that Fence renders on every code block.
 * One delegated listener covers every block on the page.
 */
export function initCodeCopy() {
  document.addEventListener('click', async (event) => {
    let button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-code-copy]')
    if (!button) return

    let code = button.parentElement?.querySelector('pre code')
    if (!code) return

    let original = button.textContent
    try {
      await navigator.clipboard.writeText(code.textContent ?? '')
      button.textContent = 'Copied!'
    } catch {
      button.textContent = 'Copy failed'
    }
    setTimeout(() => {
      button.textContent = original
    }, 2000)
  })
}
