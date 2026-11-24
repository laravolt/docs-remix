---
title: Themes
description: Switch a Laravolt app to the Workbench theme or ship your own Preline 5 theme, from one setting.
---

# Themes

Laravolt 8.4 ships the Preline 5 theme tokens and its own theme, **Workbench**: graphite surfaces and the brand indigo `#4f46e5`, in light and dark mode. Without a theme setting, apps keep the classic gray and blue look. {% .lead %}

## Turn on Workbench

Pick one:

- `.env`: `LARAVOLT_UI_THEME=workbench`
- `config/laravolt/ui.php`: `'theme' => 'workbench'`
- In the app: **Settings > Tema**, for users with `laravolt::manage-settings`

The layout then renders `<html data-theme="theme-workbench">`. Dark mode works as before, through the `dark` class and the theme switcher.

## What changes

Workbench repaints Tailwind's `gray-*` scale (to zinc) and `blue-*` scale (to indigo). Laravolt's own pages are written with those classes, and so are most application views, so both follow without markup changes. `neutral-*`, used in dark mode, is already graphite and stays as it is.

The accent behind `.btn-accent`, `.link-accent` and focus rings becomes indigo too. While a theme is on, the theme sets the accent and `laravolt.ui.color` is ignored. That setting still applies to the classic look.

## Preline 5 tokens

`main.min.css` carries the CSS variables of Preline 5's `theme.css`, for light and dark mode:

| Variable | Classic value | Use for |
|---|---|---|
| `--background-1` | `gray-50` / dark `neutral-900` | page background |
| `--layer` | white / dark `neutral-800` | cards, panels |
| `--foreground` | `gray-800` / dark `neutral-200` | body text |
| `--border-line-2` | `gray-200` / dark `neutral-700` | dividers |
| `--primary` | `blue-600` / dark `blue-500` | primary actions |

The matching utilities (`bg-layer`, `text-foreground`, `bg-primary`, ...) are generated only when a view uses them. In 8.4, Laravolt's views still use `gray-*` and `blue-*`. Later minor releases move them to the tokens one area at a time, and visual CI must show no difference for the classic look.

To use the tokens in your own views, give the app its own Tailwind build next to Laravolt's CSS (VoltProcure's `resources/css/app.css` is an example) and import the tokens there:

```css
@import "preline/theme.css";

/* theme.css sets border-color: var(--border) on every element; keep Laravolt's default. */
@layer base {
  * { border-color: currentColor; }
}
```

Your build then generates `bg-layer`, `text-foreground` and the rest for your views, and the values follow the active theme.

## Your own theme

Any other value renders `data-theme="theme-{name}"`, so you can ship a Preline 5 theme in your own stylesheet:

```css
:root[data-theme="theme-acme"] {
  --primary-50: var(--color-teal-50);
  /* ... */
  --primary-600: var(--color-teal-600);
  --primary-700: var(--color-teal-700);
}

:root[data-theme="theme-acme"].dark {
  --primary: var(--color-primary-400);
}
```

```dotenv
LARAVOLT_UI_THEME=acme
```

Preline's token reference lists every variable. Pages that still use `gray-*` and `blue-*` follow a token-only theme only once they are migrated. To recolour them today, override the scales as `resources/css/themes/workbench.css` in `laravolt/laravolt` does.

## Borders

Preline's `theme.css` gives every element `border-color: var(--border)`. Laravolt keeps Tailwind's default, `currentColor`, so a bare `border` class renders as it did before 8.4.
