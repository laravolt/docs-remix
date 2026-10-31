---
title: Installation
---

# Installation

Install Laravolt v8 into a Laravel application, publish the platform assets, run migrations, and create the first administrator account. {% .lead %}

## Requirements

Laravolt v8 targets the current Laravel and Livewire generation.

| Dependency | Version |
| --- | --- |
| PHP | `^8.3` (8.3, 8.4, 8.5) |
| Laravel framework components | `^12.68` or `^13.29` (these floors exclude versions affected by CVE-2026-114509) |
| Livewire | `^4.4` |
| Preline UI | `5.0.0`, bundled in the platform assets |
| Tailwind CSS | `4.3.3` for the bundled CSS; v4 syntax in the skeleton (`@import "tailwindcss"`) |
| Database | Any database supported by Laravel migrations |

Laravolt also relies on common PHP extensions: `bcmath`, `ctype`, `curl`, `gd`, `json`, `mbstring`, `openssl`, `pdo`, and `xml`.

## Install the package

Add Laravolt to a fresh or existing Laravel application:

```bash
composer require laravolt/laravolt:^8.1
```

For a new project, the [starter kit](https://github.com/laravolt/laravel-starter-kit) v1.8+ already includes it: `composer create-project laravolt/laravel-starter-kit my-app`.

Laravolt is split into small packages under the `laravolt/*` namespace (for example `laravolt/preline-form`, `laravolt/suitable`, `laravolt/auto-crud`). The main metapackage wires the service providers, migrations, and configuration together.

## Run the installer

```bash
php artisan laravolt:install
```

The installer publishes configuration, migrations, assets, and seed data used by the platform modules.

`laravolt:install` currently has no flags. It publishes the skeleton, Laravolt migrations, platform assets, media-library migrations, and Pest 4 setup.

## Run migrations

Laravolt ships migrations for platform tables such as users, roles, permissions, settings, jobs, media, and workflow state.

```bash
php artisan migrate
```

Follow normal Laravel migration practices in production: review the generated SQL, back up important data, and migrate during a safe deployment window.

## Create the first admin user

Create an administrator account after the platform tables exist:

```bash
php artisan laravolt:admin
```

The command asks for name, email, and password when they are not provided. It also supports positional arguments for scripted provisioning; see [Artisan commands](/reference/artisan-commands) and verify command help before using optional flags in CI.

## Build frontend assets

Laravolt v8 uses Preline UI and Tailwind CSS for its UI foundation. Install frontend dependencies with the package manager your project uses:

```bash
# npm
npm install
npm run build

# bun
bun install
bun run build

# pnpm
pnpm install
pnpm run build
```

Use the same manager consistently across development and CI. The current skeleton uses Tailwind v4 syntax in `resources/css/app.css`; align the package manager with your application starter kit.

## Project structure

A Laravolt project keeps the business application understandable by following Laravel conventions. A typical layout:

```txt
app/
  Http/
    Controllers/
    Requests/             # FormRequest classes validated on the server
  Models/
  Policies/
  Providers/
config/
  laravolt/
    platform.php
    ui.php
    menu/
      system.php
resources/
  views/
  js/
  css/
routes/
  web.php
  auth.php
```

Keep domain logic in standard Laravel locations. Use Laravolt abstractions for platform surfaces: forms (`PrelineForm`), tables (`Suitable`), menus, actions, permissions, and generated admin workflows.

## Verify the installation

After installation:

1. Visit the application in a browser.
2. Sign in with the administrator account created above.
3. Open the admin area and confirm the navigation renders.
4. Create or edit a small record using a Laravolt form.
5. Run your test suite.

```bash
php artisan test
```

If a step fails, check [Artisan commands](/reference/artisan-commands) for command details.

## What to read next

- [AI-ready platform](/core-concepts/ai-ready-platform) — the mental model for structuring Laravolt projects so teams and coding agents can extend them safely.
- [Forms overview](/forms/overview) — how `PrelineForm` turns Laravel validation and Preline UI into a single form API.
