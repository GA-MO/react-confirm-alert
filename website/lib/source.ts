import { loader } from 'fumadocs-core/source'
import { defineDocs } from 'fumadocs-mdx/macro'
import { applyMdxPreset } from 'fumadocs-mdx/config'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { docsRoute } from './shared'

import { codeThemes } from './code-themes'

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    mdxOptions: applyMdxPreset({ rehypeCodeOptions: { themes: codeThemes } })
  },
  meta: { schema: metaSchema }
})

export const source = loader({ baseUrl: docsRoute, source: docs.toFumadocsSource(), plugins: [] })
