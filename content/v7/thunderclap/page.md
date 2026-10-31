---
title: Thunderclap
description: CRUD code generator with FormRequest validation and permission gates
nextjs:
  metadata:
    title: Thunderclap Code Generator
    description: Generate production-ready CRUD modules in Laravolt 7 — with FormRequest validation, unified permission gates, and passing tests out of the box.
---

Thunderclap generates complete CRUD modules from your database schema. In Laravolt 7, generated code is production-ready by default: validation lives in FormRequest classes, routes and menus share one permission gate, and generated tests pass out of the box.

---

## Basic Usage

```bash
php artisan laravolt:clap
```

This interactive command asks you to select a database table, then generates a complete module in the `modules` directory: controller, requests, views, routes, menu entry, and tests.

You can also pass options directly:

```bash
php artisan laravolt:clap --table=posts --template=custom --force
```

| Option | Description |
| --- | --- |
| `--table` | The database table to use for code generation |
| `--template` | The template to use (default: "laravolt") |
| `--force` | Overwrite existing files |

## What's Generated

### FormRequest-Backed Forms

Each module ships with `Requests/Store.php` and `Requests/Update.php`, both extending `Illuminate\Foundation\Http\FormRequest`. The generated controller imports and typehints them:

```php
public function store(Store $request)
{
    // $request is already validated
}
```

The generated `_form.blade.php` uses PrelineForm helpers — `form()->action(...)`, `form()->submit(...)`, `form()->linkButton(...)` — so forms follow the v7 UI system automatically.

### Unified Permission Gate

Generated routes and menus share **one permission**: `modules.<module-name>.view`.

- In `routes/web.php`, routes are wrapped with `can:modules.<module-name>.view` middleware.
- The sidebar menu entry uses the same permission, so users who cannot access a module never see its menu.

Override the gate per module in `config/{module-name}.php`:

```php
// Module-wide custom gate
'permission' => 'manage-posts',

// Open access (no gate)
'permission' => false,

// OR-check: any of these permissions grants access
'permission' => ['posts.view', 'posts.manage'],
```

{% callout type="warning" title="Grant the permission" %}
After generating a module, make sure the intended roles have the `modules.<module-name>.view` permission (or a wildcard `*`) — otherwise users will get a 403 and the menu entry stays hidden.
{% /callout %}

### Tests That Pass

The generated test stub seeds an admin role with a wildcard `*` permission in `beforeEach()`, so generated CRUD tests pass immediately under the permission gate:

```bash
php artisan test --filter=PostTest
```

## Module Registration

After generating, register the module in `composer.json` PSR-4 autoloading:

```json
"autoload": {
    "psr-4": {
        "App\\": "app/",
        "Modules\\": "modules/"
    }
}
```

Then refresh the autoloader:

```bash
composer dump-autoload
```

## Custom Templates

Publish and customize the stub templates when your project has its own conventions:

```bash
php artisan vendor:publish --tag=thunderclap-stubs
```

Point `--template` to your customized template set. Generated code follows your stubs while keeping the Laravolt conventions (FormRequest, permission gate) unless you remove them.

{% callout type="note" title="Bringing modules from a v6 application?" %}
Modular Thunderclap modules can be moved into a fresh v8 base application one by one. After moving a module, align it with Laravolt conventions: add `Requests/Store.php` and `Requests/Update.php`, update its views to Preline/Tailwind, and grant the `modules.<module-name>.view` permission.
{% /callout %}
