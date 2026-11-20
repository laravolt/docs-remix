import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'
import { ImportMap } from 'remix/component/server'

import { scriptEntry } from '../assets.ts'

export interface DocumentProps {
  children?: RemixNode
  title?: string
  description?: string
  /** URL pathname of the page, for its canonical URL. */
  pathname?: string
}

export const SITE_URL = 'https://laravolt.dev'

const HOME_TITLE = 'Laravolt v8 docs: AI-ready Laravel application platform'
const DEFAULT_DESCRIPTION =
  'Laravolt v8 is an AI-ready Laravel application platform: Thunderclap scaffolding, admin UI, forms, tables, access control and workflows for business apps.'

/** Canonical URL for a pathname. Pages are served without a trailing slash. */
export function canonicalUrl(pathname: string): string {
  let clean = pathname.replace(/\/+$/, '')
  return `${SITE_URL}${clean || '/'}`
}

/** `<title>` text: the home page has its own, other pages name the docs version. */
export function pageTitle(title: string | undefined, pathname: string): string {
  let clean = pathname.replace(/\/+$/, '')
  if (clean === '' || !title) return HOME_TITLE
  let docs = clean === '/v6' || clean.startsWith('/v6/') ? 'Laravolt v6 docs' : 'Laravolt docs'
  return `${title} - ${docs}`
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, title, description = DEFAULT_DESCRIPTION, pathname = '/' } = handle.props
    let fullTitle = pageTitle(title, pathname)
    let url = canonicalUrl(pathname)
    let image = `${SITE_URL}/images/logo.png`

    return (
      <html lang="en" className="h-full antialiased">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content={description} />
          <meta name="theme-color" content="#462eb4" />
          <link rel="canonical" href={url} />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/images/logo.png" />
          <link rel="stylesheet" href="/styles.css" />
          <title>{fullTitle}</title>
          <meta property="og:site_name" content="Laravolt" />
          <meta property="og:type" content={url === `${SITE_URL}/` ? 'website' : 'article'} />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={fullTitle} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={fullTitle} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={image} />
          <meta name="twitter:image:alt" content="Laravolt" />
          <script>{`(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`}</script>
          <ImportMap value={scriptEntry.importMap} />
          {scriptEntry.preloads.map((href) => (
            <link key={href} rel="modulepreload" href={href} />
          ))}
        </head>
        <body
          mix={css({ margin: 0 })}
          className="flex min-h-full bg-white antialiased dark:bg-slate-900"
        >
          {children}
          <script type="module" src={scriptEntry.href}></script>
        </body>
      </html>
    )
  }
}
