import { loader } from 'fumadocs-core/source'
import { defineDocs } from 'fumadocs-mdx/macro'
import { applyMdxPreset } from 'fumadocs-mdx/config'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { docsRoute } from './shared'

export const codeThemes = { light: 'vitesse-light', dark: 'vitesse-dark' } as const

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    // vitesse: muted colours and dimmed punctuation, calm in light and dark (see the theme comparison).
    mdxOptions: applyMdxPreset({ rehypeCodeOptions: { themes: codeThemes } })
  },
  meta: { schema: metaSchema }
})

export const source = loader({ baseUrl: docsRoute, source: docs.toFumadocsSource(), plugins: [] })
