import type { ReactNode } from 'react'

// A live preview above the same file's source, the way shadcn and Sonner show examples.
export function Example ({ preview, children }: { preview: ReactNode, children: ReactNode }) {
  return (
    <div className="example not-prose my-6 overflow-hidden rounded-xl border bg-fd-card">
      <div className="example-preview flex min-h-40 flex-col items-center justify-center gap-3 border-b px-6 py-10">
        {preview}
      </div>
      <div className="example-code">{children}</div>
    </div>
  )
}
