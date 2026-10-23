import { loader } from 'fumadocs-core/source'
import { defineDocs } from 'fumadocs-mdx/macro'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { docsRoute } from './shared'

const docs = defineDocs({
  dir: 'content/docs',
  docs: { schema: pageSchema },
  meta: { schema: metaSchema }
})

export const source = loader({ baseUrl: docsRoute, source: docs.toFumadocsSource(), plugins: [] })
