import type { Handle } from 'remix/ui'

/**
 * Simplified icon set replacing the template's gradient-heavy SVG icons.
 * Solid sky/amber glyphs keep the visual language without the <defs> plumbing.
 */
export type IconName = 'installation' | 'presets' | 'plugins' | 'theming' | 'lightbulb' | 'warning'

const paths: Record<IconName, string> = {
  installation:
    'M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3ZM5 9.7l6 3.3v6.6l-6-3.3V9.7Zm8 9.9v-6.6l6-3.3v6.6l-6 3.3Z',
  presets:
    'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
  plugins:
    'M13 3h-2v4H7a2 2 0 0 0-2 2v2h4v2H5v2a2 2 0 0 0 2 2h4v4h2v-4h4a2 2 0 0 0 2-2v-2h-4v-2h4V9a2 2 0 0 0-2-2h-4V3Z',
  theming:
    'M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4c2 0 3.6-1.6 3.6-3.6C21 6.5 16.9 3 12 3Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z',
  lightbulb:
    'M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2ZM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z',
  warning:
    'M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z',
}

const colors: Record<string, string> = {
  amber: 'fill-amber-500',
  sky: 'fill-sky-500',
}

export function Icon(
  handle: Handle<{ icon: IconName | string; color?: string; className?: string }>,
) {
  return () => {
    let { icon, color = 'sky', className } = handle.props
    let d = paths[icon as IconName] ?? paths.presets

    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={[colors[color] ?? colors.sky, className].filter(Boolean).join(' ')}
      >
        <path d={d} />
      </svg>
    )
  }
}
