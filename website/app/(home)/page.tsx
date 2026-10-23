import Link from 'next/link'
import sizes from '../../size.json'
import { TryConfirm } from '@/components/playground/try-confirm'

export default function HomePage () {
  const sizeOf = (name: string) => sizes.find((s) => s.name === name)?.size
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-5 py-16">
      <section className="flex flex-col gap-5">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">react-confirm-alert</h1>
        <p className="text-lg text-fd-muted-foreground">
          Confirm, alert and prompt dialogs for React 18 and 19. <code>await confirm()</code>, a native modal,
          focus that moves in and back, and the v3 <code>confirmAlert</code> unchanged.
        </p>
        <div className="flex flex-wrap gap-3">
          <TryConfirm />
          <Link href="/docs" className="rounded-lg border px-4 py-2 font-medium transition hover:bg-fd-accent active:scale-[0.97]">Read the docs</Link>
          <Link href="/playground" className="rounded-lg border px-4 py-2 font-medium transition hover:bg-fd-accent active:scale-[0.97]">Playground</Link>
        </div>
      </section>
      <section className="rounded-xl border p-5">
        <h2 className="mb-3 font-semibold">Size, gzip</h2>
        <dl className="grid grid-cols-2 gap-y-1 text-sm sm:grid-cols-4">
          <dt className="text-fd-muted-foreground">confirmAlert</dt><dd>{sizeOf('import { confirmAlert } (ESM)')} B</dd>
          <dt className="text-fd-muted-foreground">confirm</dt><dd>{sizeOf('import { confirm } (ESM)')} B</dd>
        </dl>
        <p className="mt-3 text-xs text-fd-muted-foreground">Measured at build time with <code>npx size-limit --json</code>, React excluded.</p>
      </section>
    </main>
  )
}
