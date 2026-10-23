'use client'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { codeThemes } from '@/lib/code-themes'
import { call, type Theme } from './themes'

const options = { themes: codeThemes }

// The theme's setup over the call it styles. The setup block fades in again when the theme changes.
export function Snippet({ theme }: { theme: Theme }) {
  return (
    <div className="flex flex-col gap-3 [&_figure]:my-0">
      <div key={theme.id} className="animate-rise motion-reduce:animate-none">
        <DynamicCodeBlock lang={theme.setup.lang} code={theme.setup.code} options={options} codeblock={{ title: theme.setup.file }} />
      </div>
      <DynamicCodeBlock lang="tsx" code={call} options={options} codeblock={{ title: 'publish.tsx' }} />
    </div>
  )
}
