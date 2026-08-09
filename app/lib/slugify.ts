/**
 * Minimal slugify-with-counter, replacing `@sindresorhus/slugify` so the
 * server-side Markdoc pipeline has no extra ESM dependency.
 */
export function slugifyWithCounter() {
  let counts = new Map<string, number>()

  return function slugify(text: string): string {
    let slug = text
      .toLowerCase()
      .trim()
      .replace(/['’"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    let count = counts.get(slug) ?? 0
    counts.set(slug, count + 1)

    return count === 0 ? slug : `${slug}-${count}`
  }
}
