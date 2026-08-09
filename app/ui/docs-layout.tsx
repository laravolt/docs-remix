import type { Handle, RemixNode } from 'remix/ui'

import { markdownMirrorPath } from '../lib/llms.ts'
import { getVersionForPath } from '../lib/navigation.ts'
import type { Section } from '../lib/sections.ts'

function LlmsActions(handle: Handle<{ pathname: string }>) {
  return () => {
    let { pathname } = handle.props
    let mirror = markdownMirrorPath(pathname)

    let secondary =
      'inline-flex items-center gap-x-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200 ring-inset hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:ring-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200'

    return (
      <div className="mt-4 flex flex-wrap items-center gap-2" data-llms-actions={mirror}>
        <button type="button" data-llms-copy className={secondary}>
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current">
            <path
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.5 5.5V3.75c0-.69.56-1.25 1.25-1.25h4.5c.69 0 1.25.56 1.25 1.25v4.5c0 .69-.56 1.25-1.25 1.25H9.5m-4.75-5h-1.5c-.69 0-1.25.56-1.25 1.25v4.5c0 .69.56 1.25 1.25 1.25h4.5c.69 0 1.25-.56 1.25-1.25v-1.5"
            />
          </svg>
          <span data-llms-copy-label>Copy Markdown</span>
        </button>
        <a href={mirror} className={secondary}>
          View as Markdown
        </a>
        <a href="#" data-llms-open="chatgpt" target="_blank" rel="noopener noreferrer" className={secondary}>
          Open in ChatGPT
        </a>
        <a href="#" data-llms-open="claude" target="_blank" rel="noopener noreferrer" className={secondary}>
          Open in Claude
        </a>
      </div>
    )
  }
}

function DocsHeader(handle: Handle<{ pathname: string; title?: string }>) {
  return () => {
    let { pathname, title } = handle.props
    let activeVersion = getVersionForPath(pathname)
    let section = activeVersion.navigation.find((section) =>
      section.links.find((link) => link.href === pathname),
    )

    if (!title && !section) return null

    return (
      <header className="mb-9 space-y-1">
        {section ? (
          <p className="font-display text-sm font-medium text-brand-600 dark:text-brand-400">{section.title}</p>
        ) : null}
        {title ? (
          <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
        ) : null}
        <LlmsActions pathname={pathname} />
      </header>
    )
  }
}

function PrevNextLinks(handle: Handle<{ pathname: string }>) {
  return () => {
    let { pathname } = handle.props
    let activeVersion = getVersionForPath(pathname)
    let allLinks = activeVersion.navigation.flatMap((section) => section.links)
    let linkIndex = allLinks.findIndex((link) => link.href === pathname)
    let previousPage = linkIndex > 0 ? allLinks[linkIndex - 1] : null
    let nextPage = linkIndex > -1 ? (allLinks[linkIndex + 1] ?? null) : null

    if (!nextPage && !previousPage) return null

    let arrow = (flip: boolean) => (
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={'h-4 w-4 flex-none fill-current' + (flip ? ' -scale-x-100' : '')}
      >
        <path d="m9.182 13.423-1.17-1.16 3.505-3.505H3V7.065h8.517l-3.506-3.5L9.181 2.4l5.512 5.511-5.511 5.512Z" />
      </svg>
    )

    return (
      <dl className="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
        {previousPage ? (
          <div>
            <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
              Previous
            </dt>
            <dd className="mt-1">
              <a
                href={previousPage.href}
                className="flex flex-row-reverse items-center gap-x-1 text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
              >
                {previousPage.title}
                {arrow(true)}
              </a>
            </dd>
          </div>
        ) : null}
        {nextPage ? (
          <div className="ml-auto text-right">
            <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
              Next
            </dt>
            <dd className="mt-1">
              <a
                href={nextPage.href}
                className="flex items-center gap-x-1 text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
              >
                {nextPage.title}
                {arrow(false)}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
    )
  }
}

function TableOfContents(handle: Handle<{ tableOfContents: Array<Section> }>) {
  return () => {
    let { tableOfContents } = handle.props

    return (
      <div className="hidden xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
        <nav aria-labelledby="on-this-page-title" className="w-56">
          {tableOfContents.length > 0 ? (
            <>
              <h2
                id="on-this-page-title"
                className="font-display text-sm font-medium text-slate-900 dark:text-white"
              >
                On this page
              </h2>
              <ol role="list" className="mt-4 space-y-3 text-sm">
                {tableOfContents.map((section) => (
                  <li key={section.id}>
                    <h3>
                      <a
                        href={`#${section.id}`}
                        className="font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      >
                        {section.title}
                      </a>
                    </h3>
                    {section.children.length > 0 ? (
                      <ol role="list" className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400">
                        {section.children.map((subSection) => (
                          <li key={subSection.id}>
                            <a
                              href={`#${subSection.id}`}
                              className="hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              {subSection.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </nav>
      </div>
    )
  }
}

export function DocsLayout(
  handle: Handle<{
    pathname: string
    title?: string
    tableOfContents: Array<Section>
    children?: RemixNode
  }>,
) {
  return () => {
    let { pathname, title, tableOfContents, children } = handle.props

    return (
      <>
        <div className="max-w-2xl min-w-0 flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>
            <DocsHeader pathname={pathname} title={title} />
            <div className="prose max-w-none prose-slate dark:text-slate-400 dark:prose-invert prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-brand-400 dark:[--tw-prose-background:var(--color-slate-900)] prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,var(--color-brand-400))] prose-a:hover:[--tw-prose-underline-size:6px] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,var(--color-brand-700))] dark:prose-a:hover:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800">
              {children}
            </div>
          </article>
          <PrevNextLinks pathname={pathname} />
        </div>
        <TableOfContents tableOfContents={tableOfContents} />
      </>
    )
  }
}
