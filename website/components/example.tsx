import type { ReactNode } from 'react'

// A live preview above the same file's source, the way shadcn and Sonner show examples.
export function Example ({ preview, children }: { preview: ReactNode, children: ReactNode }) {
  return (
    <div className="example not-prose my-6 overflow-hidden rounded-xl border bg-fd-card">
      <div className="example-preview flex min-h-32 flex-wrap items-center justify-center gap-4 border-b p-8">
        {preview}
      </div>
      <div className="example-code">{children}</div>
    </div>
  )
}
