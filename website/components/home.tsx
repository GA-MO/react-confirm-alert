'use client'
import Link from 'next/link'
import { useState } from 'react'
import { confirm, prompt } from 'react-confirm-alert'

const starter = ['Q3 report.pdf', 'Brand guidelines.fig', 'Launch notes.md']

// Calm: 200 ms ease-out-quint, a soft scale from 98%, a backdrop that fades and blurs with it.
const calm = {
  unstyled: true,
  classNames: {
    dialog: 'fixed inset-0 m-0 open:grid size-full max-h-none max-w-none place-items-center bg-transparent p-4 backdrop:bg-zinc-950/30 backdrop:backdrop-blur-xs backdrop:transition-all backdrop:duration-200 starting:backdrop:opacity-0 data-[state=closing]:backdrop:opacity-0',
    panel: 'w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-950/5 transition duration-200 ease-out-quint outline-none starting:scale-98 starting:opacity-0 in-data-[state=closing]:scale-98 in-data-[state=closing]:opacity-0 motion-reduce:transition-none',
    title: 'text-base font-semibold text-zinc-950',
    message: 'mt-1.5 text-sm text-zinc-500',
    field: 'mt-4', input: 'h-10 w-full rounded-lg px-3 text-sm ring-1 ring-zinc-200 outline-none transition focus:ring-2 focus:ring-indigo-500 aria-invalid:ring-red-500', error: 'mt-1.5 text-sm text-red-600',
    actions: 'mt-6 grid grid-cols-2 gap-2',
    button: 'h-10 cursor-pointer rounded-lg text-sm font-medium ring-1 ring-zinc-200 transition duration-150 hover:bg-zinc-50 active:scale-98 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-progress disabled:opacity-60 data-[variant=primary]:bg-zinc-950 data-[variant=primary]:text-white data-[variant=primary]:ring-0 data-[variant=primary]:hover:bg-zinc-800 data-[variant=danger]:bg-red-600 data-[variant=danger]:text-white data-[variant=danger]:ring-0 data-[variant=danger]:hover:bg-red-500'
  }
}

type Entry = { id: number, call: string, value: string }

export function Home () {
  const [files, setFiles] = useState(starter)
  const [results, setResults] = useState<Entry[]>([])
  const [leaving, setLeaving] = useState<string | null>(null)
  const record = (call: string, value: unknown) =>
    setResults((r) => [{ id: Date.now(), call, value: JSON.stringify(value) }, ...r].slice(0, 3))

  const remove = async (name: string) => {
    const ok = await confirm({ ...calm, title: `Delete “${name}”?`, message: 'It moves to the trash for 30 days.', tone: 'danger', confirmLabel: 'Delete' })
    record('confirm()', ok)
    if (!ok) return
    // Reduced motion has no transition, so no transitionend: remove the row at once.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFiles((f) => f.filter((x) => x !== name))
      return
    }
    // The row collapses and slides out first; it leaves the list when that transition ends.
    setLeaving(name)
  }
  const rename = async (name: string) => {
    const next = await prompt({ ...calm, title: 'Rename file', defaultValue: name, submitLabel: 'Rename', validate: (v) => (v.trim() ? null : 'Give it a name') })
    record('prompt()', next)
    if (next) setFiles((f) => f.map((x) => (x === name ? next.trim() : x)))
  }

  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 content-start items-start gap-12 lg:content-center px-6 py-12 md:grid-cols-2 md:gap-10 md:py-24">
      <section>
        <p className="text-sm font-medium text-indigo-600">For React 18 and 19</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">Ask, then wait for the answer.</h1>
        <p className="mt-4 text-pretty text-lg text-zinc-600"><code className="rounded bg-zinc-100 px-1.5 py-0.5 text-base">await confirm()</code> gives you true or false. Focus moves in and back, Escape works, and your 3.0 calls keep working.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/docs" className="cursor-pointer rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition duration-150 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-98">Get started</Link>
          <Link href="/playground" className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-700 ring-1 ring-zinc-200 transition duration-150 hover:bg-zinc-50 active:scale-98">Playground</Link>
        </div>
      </section>
      <section aria-label="Try it" className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-950/5">
        <ul className="p-2">
          {files.map((f) => (
            <li key={f}
              onTransitionEnd={(e) => { if (leaving === f && e.propertyName === 'max-height') { setFiles((l) => l.filter((x) => x !== f)); setLeaving(null) } }}
              className={`flex items-center justify-between gap-2 overflow-hidden rounded-xl px-4 transition-all duration-200 ease-out-quint hover:bg-zinc-50 motion-reduce:transition-none ${leaving === f ? 'max-h-0 -translate-x-2 py-0 opacity-0' : 'max-h-16 py-3'}`}>
              <span className="truncate text-sm text-zinc-800">{f}</span>
              <span className="flex shrink-0 gap-1">
                <button onClick={() => rename(f)} className="cursor-pointer rounded-md px-2.5 py-1 text-sm text-zinc-600 ring-1 ring-zinc-200 transition duration-150 hover:bg-zinc-100 hover:ring-zinc-300 hover:text-zinc-900 active:scale-97 focus-visible:outline-2 focus-visible:outline-indigo-500">Rename</button>
                <button onClick={() => remove(f)} className="cursor-pointer rounded-md px-2.5 py-1 text-sm text-zinc-600 ring-1 ring-zinc-200 transition duration-150 hover:bg-red-50 hover:ring-red-200 hover:text-red-600 active:scale-97 focus-visible:outline-2 focus-visible:outline-indigo-500">Delete</button>
              </span>
            </li>
          ))}
          {files.length === 0 && (
            <li className="flex items-center justify-between px-4 py-3 text-sm text-zinc-500">
              Nothing left.
              <button onClick={() => setFiles(starter)} className="cursor-pointer rounded-md px-2.5 py-1 font-medium text-indigo-600 transition hover:bg-indigo-50 active:scale-97">Restore all</button>
            </li>
          )}
        </ul>
        <div aria-live="polite" className="border-t border-zinc-100 bg-zinc-50/60 px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">What the Promise returned</p>
          {results.length === 0
            ? <p className="mt-2 text-sm text-zinc-500">Rename or delete a file to see the value.</p>
            : (
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {results.map((r, i) => (
                  <li key={r.id} className={`flex items-baseline gap-2 transition-opacity duration-300 ${i === 0 ? 'animate-rise' : 'opacity-70'}`}>
                    <span className="text-zinc-500">{r.call}</span>
                    <span aria-hidden className="text-zinc-300">→</span>
                    <code className="rounded bg-white px-1.5 py-0.5 text-zinc-900 ring-1 ring-zinc-200">{r.value}</code>
                  </li>
                ))}
              </ul>
              )}
        </div>
      </section>
    </main>
  )
}
