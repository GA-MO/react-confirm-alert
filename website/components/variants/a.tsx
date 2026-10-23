'use client'
import Link from 'next/link'
import { useState } from 'react'
import { confirm } from 'react-confirm-alert'
import { VariantShell } from './shell'

const files = ['Q3 report.pdf', 'Brand guidelines.fig', 'Launch notes.md']

// Calm: 200 ms ease-out-quint, a soft scale from 98%, no bounce.
const calm = {
  unstyled: true,
  classNames: {
    dialog: 'fixed inset-0 m-0 open:grid size-full max-h-none max-w-none place-items-center bg-transparent p-4 backdrop:bg-zinc-950/30 backdrop:backdrop-blur-xs backdrop:transition-all backdrop:duration-200 starting:backdrop:opacity-0 data-[state=closing]:backdrop:opacity-0',
    panel: 'w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-950/5 transition duration-200 ease-out-quint outline-none starting:scale-98 starting:opacity-0 in-data-[state=closing]:scale-98 in-data-[state=closing]:opacity-0 motion-reduce:transition-none',
    title: 'text-base font-semibold text-zinc-950',
    message: 'mt-1.5 text-sm text-zinc-500',
    actions: 'mt-6 grid grid-cols-2 gap-2',
    button: 'h-10 cursor-pointer rounded-lg text-sm font-medium ring-1 ring-zinc-200 transition duration-150 hover:bg-zinc-50 active:scale-98 focus-visible:outline-2 focus-visible:outline-indigo-500 data-[variant=danger]:bg-red-600 data-[variant=danger]:text-white data-[variant=danger]:ring-0 data-[variant=danger]:hover:bg-red-500'
  }
}

export function VariantA () {
  const [list, setList] = useState(files)
  const [removed, setRemoved] = useState<string | null>(null)
  const remove = async (name: string) => {
    const ok = await confirm({ ...calm, title: `Delete “${name}”?`, message: 'It moves to the trash for 30 days.', tone: 'danger', confirmLabel: 'Delete' })
    if (!ok) return
    setList((l) => l.filter((f) => f !== name))
    setRemoved(name)
  }
  return (
    <VariantShell id="a">
      <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-6 pb-32 pt-16 lg:grid-cols-2">
        <section>
          <p className="text-sm font-medium text-indigo-600">For React 18 and 19</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">Ask, then wait for the answer.</h1>
          <p className="mt-4 text-lg text-zinc-600"><code className="rounded bg-zinc-100 px-1.5 py-0.5 text-base">await confirm()</code> gives you true or false. Focus moves in and back, Escape works, and your v3 calls keep working.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/docs" className="cursor-pointer rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition duration-150 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-98">Get started</Link>
            <Link href="/playground" className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-700 ring-1 ring-zinc-200 transition duration-150 hover:bg-zinc-50 active:scale-98">Playground</Link>
          </div>
        </section>
        <section aria-label="Try it" className="rounded-2xl bg-white p-2 shadow-xl ring-1 ring-zinc-950/5">
          <ul>
            {list.map((f) => (
              <li key={f} className="group flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-150 hover:bg-zinc-50">
                <span className="text-sm text-zinc-800">{f}</span>
                <button onClick={() => remove(f)} className="cursor-pointer rounded-md px-2.5 py-1 text-sm text-zinc-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 active:scale-97">Delete</button>
              </li>
            ))}
            {list.length === 0 && (
              <li className="flex items-center justify-between px-4 py-3 text-sm text-zinc-500">
                Nothing left.
                <button onClick={() => { setList(files); setRemoved(null) }} className="cursor-pointer rounded-md px-2.5 py-1 font-medium text-indigo-600 transition hover:bg-indigo-50 active:scale-97">Restore all</button>
              </li>
            )}
          </ul>
          <p aria-live="polite" className="min-h-9 px-4 py-2 text-sm text-zinc-500">
            {removed && <span key={removed} className="inline-block animate-rise">Moved “{removed}” to the trash.</span>}
          </p>
        </section>
      </main>
    </VariantShell>
  )
}
