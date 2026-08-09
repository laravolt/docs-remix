import { createController } from 'remix/router'

import { assetServer } from '../assets.ts'
import { buildLlmsFullTxt, buildLlmsTxt, pathForMarkdownMirror } from '../lib/llms.ts'
import { contentFileForPath, rawPageSource, renderPageFile } from '../lib/markdoc.ts'
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

function textResponse(body: string, contentType = 'text/plain; charset=utf-8') {
  return new Response(body, { headers: { 'Content-Type': contentType } })
}

export default createController(routes, {
  actions: {
    async assets(context) {
      return (
        (await assetServer.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
      )
    },
    llmsTxt() {
      return textResponse(buildLlmsTxt())
    },
    llmsFullTxt() {
      return textResponse(buildLlmsFullTxt())
    },
    home(context) {
      return renderDocsPage(context, '/')
    },
    page(context) {
      let pathname = `/${context.params.path}`

      // `.md` mirror: /v7/introduction.md serves the raw Markdoc source.
      let mirrorTarget = pathForMarkdownMirror(pathname)
      if (mirrorTarget !== null) {
        let source = rawPageSource(mirrorTarget)
        if (source === null) return new Response('Not Found', { status: 404 })
        return textResponse(source, 'text/markdown; charset=utf-8')
      }

      return renderDocsPage(context, pathname)
    },
  },
})
