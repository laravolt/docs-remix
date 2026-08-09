---
title: llms.txt and Copy Markdown
description: How the docs publish llms.txt, llms-full.txt, per-page .md mirrors, and the Copy Markdown button.
---

The Laravolt docs site publishes itself in a form that large language models (LLMs) and coding agents can consume directly — an `llms.txt` index, a full-text `llms-full.txt`, a `.md` mirror of every page, and an in-page **Copy Markdown** control with quick links to ChatGPT and Claude. {% .lead %}

This page explains what the feature serves, where each artifact lives, and how it is implemented. It mirrors the approach used by [Rspress SSG-MD](https://rspress.rs/guide/basic/ssg-md#ui-display) but is implemented for our Remix + Markdoc pipeline.

## What gets served

Unlike a static-site setup, nothing is generated at build time. The Remix server renders the artifacts on demand from the same `content/**/page.md` sources that power the HTML pages:

| URL | Purpose |
| --- | --- |
| `/llms.txt` | Human- and LLM-readable index. Title, short description, and a list of every page grouped by version and section. Follows the [llmstxt.org](https://llmstxt.org) convention. |
| `/llms-full.txt` | Every page concatenated, with route headers. Useful when a model can accept large context and you want the whole docs in one shot. |
| `/<route>.md` | Per-page markdown mirror. For example `/v7/forms/overview.md` returns the raw Markdoc source of that page. The home page is `/index.md`. |

A representative `llms.txt` snippet:

```text
# Laravolt

> Laravolt is a digital empowerment platform...

## Laravolt v7 — Introduction

- [Introduction](/v7/introduction.md): Laravolt v7 is an AI-ready Laravel...
- [Installation](/v7/getting-started/installation.md): Install Laravolt v7...
```

The `.md` mirrors are the same raw Markdoc you see in `content/.../page.md`. Markdoc tags (`{% callout %}`, `{% quick-links %}`) are kept intact — they do not hurt LLM comprehension and keep the response small.

## The "Copy Markdown" control

Every docs page renders an action row below its title:

- **Copy Markdown** — fetches the current route's `.md` mirror and places it on the clipboard.
- **View as Markdown** — opens the `.md` mirror directly; copy its URL to paste into any tool that can fetch a URL.
- **Open in ChatGPT** — opens `chatgpt.com` in a new tab with a prompt pointing at this page's `.md` URL.
- **Open in Claude** — opens `claude.ai` in a new tab with the same prompt.

The prompt is intentionally conservative:

```text
Read https://<your-domain>/v7/forms/overview.md and help me understand,
summarize, and answer questions about the content.
```

Feel free to adjust the phrasing in `app/assets/llms-copy.ts` if your users prefer a different prompt.

## How routes map to files

The mirror URL is the page URL with `.md` appended (or `/index.md` at the root):

| Source | Route | Mirror URL |
| --- | --- | --- |
| `content/page.md` | `/` | `/index.md` |
| `content/v7/introduction/page.md` | `/v7/introduction` | `/v7/introduction.md` |
| `content/v7/forms/overview/page.md` | `/v7/forms/overview` | `/v7/forms/overview.md` |

Because everything is served from the live route handlers, there is no generator to run and no `.gitignore` bookkeeping — editing a page updates its `.md` mirror, `llms.txt`, and `llms-full.txt` immediately.

## Pointing AI tools at the docs

Publish the following URLs once the site is deployed:

- `https://<your-domain>/llms.txt` — index for agents that support llms.txt.
- `https://<your-domain>/llms-full.txt` — everything, concatenated.
- `https://<your-domain>/<route>.md` — per-page access.

Anecdotally, the per-page `.md` URL is the most useful day-to-day: it is cheap to fetch, keeps context windows small, and plays well with the **View as Markdown** action.

## Implementation pointers

If you need to customize behaviour, these are the files to edit:

- `app/lib/llms.ts` — builds `llms.txt` and `llms-full.txt` from the navigation tree, and maps routes to `.md` mirror URLs.
- `app/actions/controller.tsx` — the route handlers: `llmsTxt`, `llmsFullTxt`, and the `.md` branch of the catch-all `page` action.
- `app/ui/docs-layout.tsx` — `LlmsActions`, the server-rendered action row under the page title.
- `app/assets/llms-copy.ts` — client-side wiring: clipboard copy and the ChatGPT / Claude prompt links.

## Limitations

- Markdoc tags are preserved verbatim. An LLM that has never seen the syntax may try to render `{% callout %}` literally. In practice, recent models ignore it, but if you want strict CommonMark, strip Markdoc tags in the `.md` branch of the `page` action before responding.
- Only pages linked from the navigation (`app/lib/navigation.ts`) appear in `llms.txt` and `llms-full.txt`. Unlinked pages still get `.md` mirrors, but are not indexed.
- The prompt used for ChatGPT / Claude hints at reading a URL; both services accept the query parameter but the exact rendering depends on their product decisions at the time of click.

## What to read next

- [AI-ready platform](/v7/core-concepts/ai-ready-platform) — the broader stance that `llms.txt` and Copy Markdown support.
