import type { Handle, RemixNode } from 'remix/ui'

import { getVersionForPath, versions } from '../lib/navigation.ts'
import { Hero } from './hero.tsx'

function Logomark(handle: Handle<{ className?: string }>) {
  return () => (
    <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" className={handle.props.className}>
      <text x="6" y="28" fontSize="24" fontWeight="bold" fill="#38BDF8">
        ⚡
      </text>
    </svg>
  )
}

function Logo(handle: Handle<{ className?: string }>) {
  return () => (
    <svg aria-hidden="true" viewBox="0 0 250 36" fill="none" className={handle.props.className}>
      <text x="6" y="28" fontSize="24" fontWeight="bold" fill="#38BDF8">
        ⚡
      </text>
      <text
        x="44"
        y="25"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="16"
        fontWeight="bold"
        className="fill-slate-700 dark:fill-sky-100"
      >
        Laravolt
      </text>
    </svg>
  )
}

function GitHubIcon(handle: Handle<{ className?: string }>) {
  return () => (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={handle.props.className}>
      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
    </svg>
  )
}

function VersionSelector(handle: Handle<{ pathname: string }>) {
  return () => {
    let active = getVersionForPath(handle.props.pathname)

    return (
      <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-sm font-medium dark:bg-slate-800">
        {versions.map((version) => (
          <a
            key={version.id}
            href={version.homeHref}
            className={
              version.id === active.id
                ? 'rounded-md bg-white px-2 py-0.5 text-sky-600 shadow-sm dark:bg-slate-700 dark:text-sky-400'
                : 'px-2 py-0.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }
          >
            {version.label}
          </a>
        ))}
      </div>
    )
  }
}

function Navigation(handle: Handle<{ pathname: string; className?: string }>) {
  return () => {
    let { pathname, className } = handle.props
    let activeVersion = getVersionForPath(pathname)

    return (
      <nav className={['text-base lg:text-sm', className].filter(Boolean).join(' ')}>
        <p className="mb-6 flex items-baseline gap-2 font-display text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          <span>Laravolt {activeVersion.label}</span>
          <span className="text-[10px] font-medium tracking-normal text-slate-400 normal-case dark:text-slate-500">
            {activeVersion.description}
          </span>
        </p>
        <ul role="list" className="space-y-9">
          {activeVersion.navigation.map((section) => (
            <li key={section.title}>
              <h2 className="font-display font-medium text-slate-900 dark:text-white">
                {section.title}
              </h2>
              <ul
                role="list"
                className="mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800"
              >
                {section.links.map((link) => (
                  <li key={link.href} className="relative">
                    <a
                      href={link.href}
                      className={
                        'block w-full pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full ' +
                        (link.href === pathname
                          ? 'font-semibold text-sky-500 before:bg-sky-500'
                          : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300')
                      }
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
}

function Header(handle: Handle<{ pathname: string }>) {
  return () => (
    <header className="sticky top-0 z-50 flex flex-none flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 sm:px-6 lg:px-8 dark:bg-slate-900/95 dark:shadow-none dark:backdrop-blur-sm">
      <div className="relative flex grow basis-0 items-center space-x-3 sm:space-x-4">
        <a href="/" aria-label="Home page">
          <Logomark className="h-9 w-9 lg:hidden" />
          <Logo className="hidden h-9 w-auto lg:block" />
        </a>
      </div>
      <div className="relative flex basis-0 items-center justify-end gap-4 sm:gap-6 md:grow">
        <VersionSelector pathname={handle.props.pathname} />
        <a href="https://github.com/laravolt/laravolt" className="group" aria-label="GitHub">
          <GitHubIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
        </a>
      </div>
    </header>
  )
}

export function Layout(handle: Handle<{ pathname: string; children?: RemixNode }>) {
  return () => {
    let { pathname, children } = handle.props

    return (
      <div className="flex w-full flex-col">
        <Header pathname={pathname} />

        {pathname === '/' && <Hero />}

        <div className="relative mx-auto flex w-full max-w-8xl flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
          <div className="hidden lg:relative lg:block lg:flex-none">
            <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
            <div className="absolute top-16 right-0 bottom-0 hidden h-12 w-px bg-linear-to-t from-slate-800 dark:block" />
            <div className="absolute top-28 right-0 bottom-0 hidden w-px bg-slate-800 dark:block" />
            <div className="sticky top-[4.75rem] -ml-0.5 h-[calc(100vh-4.75rem)] w-64 overflow-x-hidden overflow-y-auto py-16 pr-8 pl-0.5 xl:w-72 xl:pr-16">
              <Navigation pathname={pathname} />
            </div>
          </div>
          {children}
        </div>
      </div>
    )
  }
}
