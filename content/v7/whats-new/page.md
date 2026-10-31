---
title: What's New
description: Laravolt 8 and 8.1 — supported versions, Preline 5, Octane-safe menus — and the Laravolt 7 overhaul
nextjs:
  metadata:
    title: What's New in Laravolt 8
    description: Laravolt 8 requires PHP 8.3+ and Laravel 12.68+/13.29+, ships Preline 5 and Tailwind 4.3 in 8.1, and makes the sidebar safe for Octane and persistent caches.
---

## Laravolt 8.1

Released 31 October 2026. [Release notes](https://github.com/laravolt/laravolt/releases/tag/v8.1.0).

- **Preline UI 5.0 and Tailwind CSS 4.3.** The bundled CSS is now built from source in the repository and checked in CI, so `main.min.css` always matches its sources. Classes used by Laravolt's own views that were missing from the old prebuilt CSS now work: hover states, `dark:` variants, tooltip arrows, and more.
- **The menu works without the default sidebar.** Config menus and `laravolt.menu.builder` callbacks are loaded when the menu is read, so `app('laravolt.menu.sidebar')->allMenu()` works in any layout, including one that replaces `laravolt::menu.sidebar`.
- **Fixes:** `/platform/components` no longer returns 500, and the permissions page writes only changed rows.

Upgrade with `composer update laravolt/laravolt`. In a `local` environment that already has `public/laravolt`, run `php artisan laravolt:extract-assets` once to get the new CSS.

## Laravolt 8.0

- **Requirements:** PHP 8.3+ and Laravel 12.68+ or 13.29+. Laravel 11 is no longer supported. The floors exclude framework versions affected by CVE-2026-114509.
- **Leaner install:** `laravel/octane`, `barryvdh/laravel-dompdf`, `barryvdh/laravel-debugbar` and `spatie/laravel-web-tinker` are no longer installed with Laravolt. Require them yourself if your app uses them.
- **8.0.1: safe for Octane and persistent caches.** In production with a file, database or redis cache, every page after the first used to return 500 on Laravel 13. Under Octane the sidebar grew on every request. Both are fixed. Use 8.0.1 or later in production.
- **laravolt/avatar 8.0.1** fixes the same class of cache bug for avatars.

### Upgrading from v7

1. Make sure the app runs on PHP 8.3+ and Laravel 12.68+ or 13.29+.
2. If you use them, require `laravel/octane`, `barryvdh/laravel-dompdf`, `barryvdh/laravel-debugbar` or `spatie/laravel-web-tinker` directly.
3. `composer require laravolt/laravolt:^8.1`

There are no API changes between v7 and v8, so application code keeps working.

---

## Laravolt 7

Laravolt 7 is the biggest release in the platform's history: a complete UI overhaul from Fomantic UI to Preline UI + Tailwind CSS, a smarter Thunderclap generator, and a foundation modernized for the latest Laravel and PHP.

---

### Highlights

{% quick-links %}

{% quick-link title="Preline UI + Tailwind CSS" icon="theming" href="/ui-components" description="Every component rewritten on Preline UI v3 with dark mode support out of the box." /%}

{% quick-link title="Smarter Thunderclap" icon="plugins" href="/thunderclap" description="Generated modules ship with FormRequest validation and a unified permission gate." /%}

{% quick-link title="Installation" icon="installation" href="/installation" description="Start a fresh project with the Laravel starter kit." /%}

{% /quick-links %}

### A New UI Foundation: Preline UI + Tailwind CSS

Laravolt 6 and earlier were built on Fomantic UI. Version 7 replaces it entirely with [Preline UI](https://preline.co) v3 on top of Tailwind CSS:

- **All `<x-volt-*>` components rewritten** — Alert, Button, Modal, Dropdown, Switch, Input, Table, Card, Panel, Badge, and more now use Preline UI patterns and Tailwind utility classes.
- **Dark mode everywhere** — components support dark mode via Tailwind `dark:` variants.
- **New components** — `<x-volt-time-picker>` and `<x-volt-advanced-datepicker>` (with range selection, min/max constraints, and custom formats).
- **Richer variants** — buttons gain `soft`, `outline`, `ghost`, `link`, and `warning` variants, `2xs`/`xs` sizes, loading spinners, and pill shapes; modals gain header/footer slots, `centered`, `scrollable`, and `static` options.
- **Floating UI positioning** — modals and dropdowns now position with Floating UI instead of Popper.js.
- **Zero Fomantic leakage** — an automated regression test scans published views to guarantee no legacy `ui *` classes remain.

Suitable's `Label` column now renders a Preline pill badge instead of a Fomantic `ui label`. Existing `addClass()`, `addClassIf()`, and `map()` calls keep working — pass Tailwind utilities for custom palettes.

### Smarter Code Generation

Thunderclap-generated CRUD modules are now production-ready by default:

- **FormRequest-backed forms** — `Requests/Store.php` and `Requests/Update.php` extend Laravel's `FormRequest`, and controllers typehint them. Validation lives where it belongs.
- **One permission gate per module** — generated routes and sidebar menus share a single `modules.<module-name>.view` permission, enforced via `can:` middleware. Override per module in `config/{module-name}.php`: a string for a module-wide gate, `false` for open access, or an array for OR-checks.
- **Passing tests out of the box** — the generated test stub seeds an admin role with a wildcard `*` permission so CRUD tests pass under the new gate.

### Modernized Foundation

- **Latest Laravel and PHP** — the official [starter kit](https://github.com/laravolt/laravel-starter-kit) ships on Laravel 13 with PHP 8.5.
- **Docker templates** — the starter kit includes ready-to-use Docker templates for development and production.
- **Hardened permission cache** — stale serialized permission values are detected and recovered automatically.
- **Font Awesome 5 icons** — rendered through Blade Icons (`<x-volt-icon name="shield"/>`).

### Coming from v6?

Laravolt 7 is a major release with breaking changes, and there is no in-place upgrade path from v6. The recommended approach is to start a fresh v7 application from the [starter kit](https://github.com/laravolt/laravel-starter-kit) — if your v6 application was built with modular Thunderclap, you can then move your modules over one by one.

{% callout type="note" title="Staying on v6?" %}
Version 6 documentation remains available under the v6 section. New features land in the current version only.
{% /callout %}
