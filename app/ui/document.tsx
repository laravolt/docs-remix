import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'

import { routes } from '../routes.ts'

export interface DocumentProps {
  children?: RemixNode
  title?: string
  description?: string
}

const DEFAULT_TITLE = 'Laravolt - Digital empowerment platform.'
const DEFAULT_DESCRIPTION =
  'Explore the official documentation for Laravolt, a digital empowerment platform designed to accelerate application development.'

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, title, description = DEFAULT_DESCRIPTION } = handle.props

    return (
      <html lang="en" className="h-full antialiased">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content={description} />
          <meta name="theme-color" content="#462eb4" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/images/logo.png" />
          <link rel="stylesheet" href="/styles.css" />
          <title>{title ? `${title} - Docs` : DEFAULT_TITLE}</title>
          <meta property="og:site_name" content="Laravolt" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={title ? `${title} - Laravolt` : DEFAULT_TITLE} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content="/images/logo.png" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title ? `${title} - Laravolt` : DEFAULT_TITLE} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content="/images/logo.png" />
          <meta name="twitter:image:alt" content="Laravolt" />
          <script>{`(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`}</script>
        </head>
        <body
          mix={css({ margin: 0 })}
          className="flex min-h-full bg-white antialiased dark:bg-slate-900"
        >
          {children}
          <script type="module" src={routes.assets.href({ path: 'app/assets/entry.ts' })}></script>
        </body>
      </html>
    )
  }
}
