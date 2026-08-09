import { createController } from 'remix/router'

import { assetServer } from '../assets.ts'
import { contentFileForPath, renderPageFile } from '../lib/markdoc.ts'
import { routes } from '../routes.ts'
import { DocsLayout } from '../ui/docs-layout.tsx'
import { Document } from '../ui/document.tsx'
import { Layout } from '../ui/layout.tsx'
import { renderMarkdoc } from '../ui/markdoc.tsx'

function renderDocsPage(context: any, pathname: string) {
  let file = contentFileForPath(pathname)
  if (!file) return new Response('Not Found', { status: 404 })

  let { frontmatter, content, tableOfContents } = renderPageFile(file)

  return context.render(
    <Document title={frontmatter.title} description={frontmatter.description}>
      <Layout pathname={pathname}>
        <DocsLayout pathname={pathname} title={frontmatter.title} tableOfContents={tableOfContents}>
          {renderMarkdoc(content)}
        </DocsLayout>
      </Layout>
    </Document>,
  )
}

export default createController(routes, {
  actions: {
    async assets(context) {
      return (
        (await assetServer.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
      )
    },
    home(context) {
      return renderDocsPage(context, '/')
    },
    page(context) {
      return renderDocsPage(context, `/${context.params.path}`)
    },
  },
})
