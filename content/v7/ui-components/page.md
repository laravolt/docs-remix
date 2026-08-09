---
title: UI Components
description: Preline UI powered Blade components for building modern interfaces
nextjs:
  metadata:
    title: UI Components — Preline UI + Tailwind
    description: Reference for Laravolt 7's Blade components, rebuilt on Preline UI v3 and Tailwind CSS with dark mode support.
---

Laravolt 7 ships a complete set of Blade components rebuilt on [Preline UI](https://preline.co) v3 and Tailwind CSS. Every component supports dark mode via Tailwind `dark:` variants.

---

## Basic Usage

All components use the `volt` prefix:

```blade
<x-volt-button variant="primary">Save Changes</x-volt-button>
```

## Layout Components

- `<x-volt-app>` — main application layout with sidebar navigation
- `<x-volt-panel>` — card panel with optional header and footer
- `<x-volt-card>` — clickable card component
- `<x-volt-backlink>` — back navigation link

For grids, use Tailwind utilities directly:

```blade
<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
  <x-volt-card title="Users" url="/users"/>
  <x-volt-card title="Roles" url="/roles"/>
  <x-volt-card title="Permissions" url="/permissions"/>
</div>
```

## Button

```blade
<x-volt-button
    variant="primary"
    size="md"
    :loading="false"
    :pill="false"
    icon="save"
    icon-position="left"
>
    Save Changes
</x-volt-button>
```

- **Variants**: `primary`, `secondary`, `danger`, `success`, `warning`, `soft`, `outline`, `ghost`, `link`
- **Sizes**: `2xs`, `xs`, `sm`, `md`, `lg`
- **Options**: `loading` (shows a spinner), `pill` (fully rounded), `icon` + `icon-position`

Use `<x-volt-link-button>` for anchors styled as buttons.

## Alert

```blade
<x-volt-alert type="success" size="md" :dismissable="true" :border="true">
    Data saved successfully.
</x-volt-alert>
```

Alerts come in `sm`, `md`, and `lg` sizes, with optional `rounded` and `border` styling. Dismissal uses Preline's `hs-remove-element`.

## Modal

```blade
<x-volt-modal id="confirm-delete" size="md" :centered="true" :scrollable="false">
    <x-slot name="header">Delete User</x-slot>

    Are you sure you want to delete this user?

    <x-slot name="footer">
        <x-volt-button variant="secondary">Cancel</x-volt-button>
        <x-volt-button variant="danger">Delete</x-volt-button>
    </x-slot>
</x-volt-modal>
```

Sizes range from `xs` to `7xl`. Use `static` to prevent closing on backdrop click. Positioning is handled by Floating UI.

## Dropdown

Dropdowns support 12 placement positions plus `strategy` and `auto-close` options, positioned with Floating UI:

```blade
<x-volt-dropdown placement="bottom-end">
    <x-slot name="trigger">Actions</x-slot>
    <a href="#" class="...">Edit</a>
    <a href="#" class="...">Delete</a>
</x-volt-dropdown>
```

## Switch

The Switch component was rewritten in v7 with a data-driven, button-based approach:

```blade
<x-volt-switch
    label="Enable notifications"
    description="Receive email notifications"
    :checked="true"
    size="md"
    variant="primary"
    label-position="end"
/>
```

## Form Inputs

- `<x-volt-input>` — text input with consistent focus, error, and disabled states
- `<x-volt-time-picker>` — **new in v7**; 12h/24h formats, clearable, size variants:

```blade
<x-volt-time-picker label="Select time" format="24h" :clearable="true" size="md"/>
```

- `<x-volt-advanced-datepicker>` — **new in v7**; date ranges, min/max constraints, custom formats:

```blade
<x-volt-advanced-datepicker
    label="Report period"
    :range="true"
    min-date="2026-01-01"
    format="DD-MM-YYYY"
    :clearable="true"
/>
```

## Table and Badge

- `<x-volt-table>` — styled table matching TableView and Suitable output
- `<x-volt-badge>` — pill badge component

In table columns, Suitable's `Label` column renders a Preline pill badge. Customize colors with Tailwind utilities:

```php
Label::make('status')->addClass('bg-teal-100 text-teal-800'),
```

## Icons

Icons use Font Awesome 5 through Blade Icons:

```blade
<x-volt-icon name="shield"/>
```

The icon prefix is configured in `config/laravolt/ui.php` (`iconset` key).

{% callout type="warning" title="Coming from v6?" %}
Fomantic UI classes (`ui button`, `ui grid`, `ui card`, ...) no longer exist in v7. Use Tailwind utilities or the `<x-volt-*>` components above instead.
{% /callout %}
