---
title: What's New in Laravolt 7
description: Preline UI, smarter generators, and a modernized foundation
nextjs:
  metadata:
    title: What's New in Laravolt 7
    description: Laravolt 7 brings a full migration to Preline UI + Tailwind CSS, FormRequest-backed generators with permission gates, and a modernized foundation on the latest Laravel and PHP.
---

Laravolt 7 is the biggest release in the platform's history: a complete UI overhaul from Fomantic UI to Preline UI + Tailwind CSS, a smarter Thunderclap generator, and a foundation modernized for the latest Laravel and PHP.

---

## Highlights

{% quick-links %}

{% quick-link title="Preline UI + Tailwind CSS" icon="theming" href="/ui-components" description="Every component rewritten on Preline UI v3 with dark mode support out of the box." /%}

{% quick-link title="Smarter Thunderclap" icon="plugins" href="/thunderclap" description="Generated modules ship with FormRequest validation and a unified permission gate." /%}

{% quick-link title="Installation" icon="installation" href="/installation" description="Start a fresh project with the Laravel starter kit." /%}

{% /quick-links %}

## A New UI Foundation: Preline UI + Tailwind CSS

Laravolt 6 and earlier were built on Fomantic UI. Version 7 replaces it entirely with [Preline UI](https://preline.co) v3 on top of Tailwind CSS:

- **All `<x-volt-*>` components rewritten** — Alert, Button, Modal, Dropdown, Switch, Input, Table, Card, Panel, Badge, and more now use Preline UI patterns and Tailwind utility classes.
- **Dark mode everywhere** — components support dark mode via Tailwind `dark:` variants.
- **New components** — `<x-volt-time-picker>` and `<x-volt-advanced-datepicker>` (with range selection, min/max constraints, and custom formats).
- **Richer variants** — buttons gain `soft`, `outline`, `ghost`, `link`, and `warning` variants, `2xs`/`xs` sizes, loading spinners, and pill shapes; modals gain header/footer slots, `centered`, `scrollable`, and `static` options.
- **Floating UI positioning** — modals and dropdowns now position with Floating UI instead of Popper.js.
- **Zero Fomantic leakage** — an automated regression test scans published views to guarantee no legacy `ui *` classes remain.

Suitable's `Label` column now renders a Preline pill badge instead of a Fomantic `ui label`. Existing `addClass()`, `addClassIf()`, and `map()` calls keep working — pass Tailwind utilities for custom palettes.

## Smarter Code Generation

Thunderclap-generated CRUD modules are now production-ready by default:

- **FormRequest-backed forms** — `Requests/Store.php` and `Requests/Update.php` extend Laravel's `FormRequest`, and controllers typehint them. Validation lives where it belongs.
- **One permission gate per module** — generated routes and sidebar menus share a single `modules.<module-name>.view` permission, enforced via `can:` middleware. Override per module in `config/{module-name}.php`: a string for a module-wide gate, `false` for open access, or an array for OR-checks.
- **Passing tests out of the box** — the generated test stub seeds an admin role with a wildcard `*` permission so CRUD tests pass under the new gate.

## Modernized Foundation

- **Latest Laravel and PHP** — the official [starter kit](https://github.com/laravolt/laravel-starter-kit) ships on Laravel 13 with PHP 8.5.
- **Docker templates** — the starter kit includes ready-to-use Docker templates for development and production.
- **Hardened permission cache** — stale serialized permission values are detected and recovered automatically.
- **Font Awesome 5 icons** — rendered through Blade Icons (`<x-volt-icon name="shield"/>`).

## Coming from v6?

Laravolt 7 is a major release with breaking changes, and there is no in-place upgrade path from v6. The recommended approach is to start a fresh v7 application from the [starter kit](https://github.com/laravolt/laravel-starter-kit) — if your v6 application was built with modular Thunderclap, you can then move your modules over one by one.

{% callout type="note" title="Staying on v6?" %}
Version 6 documentation remains available under the v6 section. New features land in v7 only.
{% /callout %}
