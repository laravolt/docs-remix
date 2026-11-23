/**
 * Pages that moved. Each old URL answers 301 to its new home, both from the
 * dev server and from the static `_redirects` file written by the prerender.
 * The `.md` mirror of each old URL follows the same move.
 */
export const movedPages: Record<string, string> = {
  // Merged into the getting-started guide (Docker section) on 2026-11-23.
  '/installation': '/getting-started/installation',
  // Merged into the admin-workflows page (stubs and namespace) on 2026-11-23.
  '/thunderclap': '/admin-workflows/thunderclap',
}

/** `_redirects` lines for every moved page and its `.md` mirror. */
export function movedPageRedirects(): string[] {
  return Object.entries(movedPages).flatMap(([from, to]) => [
    `${from} ${to} 301`,
    `${from}.md ${to}.md 301`,
  ])
}
