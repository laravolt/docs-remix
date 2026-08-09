function prefersDark(): boolean {
  try {
    let stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored === 'dark'
  } catch {
    // localStorage unavailable (private mode, etc.) — fall through
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(): void {
  document.documentElement.classList.toggle('dark', prefersDark())
}

export function initTheme(): void {
  applyTheme()

  // Re-apply whenever a client-side navigation re-renders <html> and
  // overwrites its class attribute (which drops the `dark` class).
  let observer = new MutationObserver(() => {
    if (document.documentElement.classList.contains('dark') !== prefersDark()) {
      applyTheme()
    }
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', applyTheme)
}
