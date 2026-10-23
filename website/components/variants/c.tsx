'use client'
import Link from 'next/link'
import { useState } from 'react'
import { confirm, prompt } from 'react-confirm-alert'
import { VariantShell } from './shell'

const crisp = {
  unstyled: true,
  classNames: {
    dialog: 'fixed inset-0 m-0 open:grid size-full max-h-none max-w-none place-items-center bg-transparent p-4 backdrop:bg-slate-900/20 backdrop:transition-opacity backdrop:duration-150 starting:backdrop:opacity-0 data-[state=closing]:backdrop:opacity-0',
    panel: 'w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 font-mono text-sm shadow-xl transition duration-150 ease-out outline-none starting:-translate-y-2 starting:opacity-0 in-data-[state=closing]:opacity-0 motion-reduce:transition-none',
    title: 'font-semibold text-slate-900', message: 'mt-1 text-slate-500',
    field: 'mt-4', input: 'h-9 w-full rounded-md border border-slate-300 px-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 aria-invalid:border-rose-500', error: 'mt-1 text-rose-600',
    actions: 'mt-5 flex justify-end gap-2',
    button: 'h-8 cursor-pointer rounded-md border border-slate-200 px-3 text-slate-700 transition duration-100 hover:bg-slate-50 active:scale-97 disabled:cursor-progress disabled:opacity-60 data-[variant=primary]:border-sky-600 data-[variant=primary]:bg-sky-600 data-[variant=primary]:text-white data-[variant=danger]:border-rose-600 data-[variant=danger]:bg-rose-600 data-[variant=danger]:text-white aria-busy:animate-pulse'
  }
}

const examples = {
  confirm: { code: "const ok = await confirm({\n  title: 'Drop table users?',\n  tone: 'danger',\n})", run: () => confirm({ ...crisp, title: 'Drop table users?', message: 'This cannot be undone.', tone: 'danger', confirmLabel: 'Drop' }) },
  async: { code: "await confirm({\n  title: 'Deploy to production?',\n  onConfirm: () => deploy(),\n}) // busy until deploy() settles", run: () => confirm({ ...crisp, title: 'Deploy to production?', confirmLabel: 'Deploy', onConfirm: () => new Promise<void>((r) => setTimeout(r, 1200)) }) },
  prompt: { code: "const branch = await prompt({\n  title: 'New branch',\n  validate: (v) => /^[a-z-]+$/.test(v) ? null : 'a-z and -',\n})", run: () => prompt({ ...crisp, title: 'New branch', label: 'name', defaultValue: 'feat-', validate: (v) => (/^[a-z-]+$/.test(v) ? null : 'Use a-z and -') }) }
} as const

export function VariantC () {
  const [tab, setTab] = useState<keyof typeof examples>('confirm')
  const [log, setLog] = useState<string[]>([])
  const run = async () => {
    const t = tab
    setLog((l) => [`> ${t}()`, ...l].slice(0, 6))
    const result = await examples[t].run()
    setLog((l) => [`← ${JSON.stringify(result)}`, ...l].slice(0, 6))
  }
  return (
    <VariantShell id="c">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-44 pt-14">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Dialogs that return values.</h1>
        <p className="mt-3 max-w-2xl text-slate-600">One function call, one Promise. Run it and read what came back.</p>
        <div className="mt-8 grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            <div role="tablist" className="flex gap-1 border-b border-slate-200 bg-slate-50 p-1.5">
              {(Object.keys(examples) as (keyof typeof examples)[]).map((k) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="cursor-pointer rounded-md px-3 py-1.5 font-mono text-xs text-slate-500 transition duration-100 hover:text-slate-900 aria-selected:bg-white aria-selected:text-slate-900 aria-selected:shadow-sm">{k}</button>
              ))}
            </div>
            <pre key={tab} className="animate-rise overflow-x-auto p-5 font-mono text-sm leading-6 text-slate-800">{examples[tab].code}</pre>
            <div className="px-5 pb-5">
              <button onClick={run} className="cursor-pointer rounded-md bg-slate-900 px-4 py-2 font-mono text-sm text-white transition duration-100 hover:bg-slate-700 active:scale-97">Run ▸</button>
            </div>
          </div>
          <div aria-live="polite" className="min-h-48 bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-300">
            {log.length === 0 ? <p className="text-slate-500">// results appear here</p> : log.map((l, i) => <p key={`${log.length}-${i}`} className={`${i === 0 ? 'animate-rise' : ''} ${l.startsWith('←') ? 'text-emerald-400' : ''}`}>{l}</p>)}
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <Link href="/docs" className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 active:scale-97">Docs</Link>
          <Link href="/playground" className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 active:scale-97">Playground</Link>
        </div>
      </main>
    </VariantShell>
  )
}
