'use client'
import Link from 'next/link'
import { useState } from 'react'
import { alert, confirm, prompt } from 'react-confirm-alert'
import { VariantShell } from './shell'

// Playful: a small overshoot on open (ease-spring), a quicker plain fade on close.
const springy = {
  unstyled: true,
  classNames: {
    dialog: 'fixed inset-0 m-0 open:grid size-full max-h-none max-w-none place-items-center bg-transparent p-4 backdrop:bg-orange-950/20 backdrop:transition-opacity backdrop:duration-300 starting:backdrop:opacity-0 data-[state=closing]:backdrop:opacity-0',
    panel: 'w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl shadow-orange-900/10 transition duration-300 ease-spring outline-none starting:translate-y-4 starting:scale-90 starting:opacity-0 in-data-[state=closing]:scale-95 in-data-[state=closing]:opacity-0 in-data-[state=closing]:duration-150 in-data-[state=closing]:ease-out motion-reduce:transition-none',
    title: 'text-xl font-bold text-stone-900',
    message: 'mt-2 text-stone-500',
    field: 'mt-5', input: 'h-12 w-full rounded-2xl border-2 border-stone-200 px-4 text-center text-lg outline-none transition focus:border-orange-400 aria-invalid:border-rose-400', error: 'mt-2 text-sm text-rose-500',
    actions: 'mt-6 flex justify-center gap-3',
    button: 'h-11 cursor-pointer rounded-full px-6 font-semibold text-stone-600 transition duration-200 ease-spring hover:bg-stone-100 active:scale-95 data-[variant=primary]:bg-orange-500 data-[variant=primary]:text-white data-[variant=primary]:shadow-lg data-[variant=primary]:shadow-orange-500/30 data-[variant=primary]:hover:-translate-y-0.5 data-[variant=danger]:bg-rose-500 data-[variant=danger]:text-white'
  }
}

export function VariantB () {
  const [name, setName] = useState<string | null>(null)
  const [last, setLast] = useState('Pick one. Each opens a real dialog.')
  const chips = [
    { label: 'alert()', run: async () => { await alert({ ...springy, title: 'Saved!', message: 'Your changes are safe.' }); setLast('alert() resolved') } },
    { label: 'confirm()', run: async () => setLast(`confirm() → ${await confirm({ ...springy, title: 'Leave without saving?', tone: 'danger', confirmLabel: 'Leave' })}`) },
    { label: 'prompt()', run: async () => { const v = await prompt({ ...springy, title: 'What should we call you?', defaultValue: name ?? '', validate: (x) => (x.trim() ? null : 'A name, please') }); if (v) setName(v.trim()); setLast(`prompt() → ${JSON.stringify(v)}`) } }
  ]
  return (
    <VariantShell id="b">
      <main className="relative flex flex-1 flex-col items-center overflow-hidden px-6 pb-44 pt-20 text-center">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 size-144 -translate-x-1/2 rounded-full bg-orange-200/50 blur-3xl" />
        <h1 className="relative w-full text-balance text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">
          {name ? <span key={name} className="inline-block animate-rise">Hi, {name}.</span> : 'Dialogs, but friendly.'}
        </h1>
        <p className="relative mt-5 w-full max-w-xl text-pretty text-lg text-stone-600">Confirm, alert and prompt that return a Promise, look like your app, and never leave focus stranded.</p>
        <div className="relative mt-10 flex w-full flex-wrap justify-center gap-3">
          {chips.map((c) => (
            <button key={c.label} onClick={c.run} className="cursor-pointer rounded-full bg-white px-5 py-3 font-mono text-sm font-medium text-stone-800 shadow-md ring-1 ring-stone-200 transition duration-200 ease-spring hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-95">{c.label}</button>
          ))}
        </div>
        <p aria-live="polite" className="relative mt-6 h-6 font-mono text-sm text-stone-500"><span key={last} className="inline-block animate-rise">{last}</span></p>
        <Link href="/docs" className="relative mt-10 cursor-pointer rounded-full bg-stone-900 px-6 py-3 font-semibold text-white shadow-lg transition duration-200 ease-spring hover:-translate-y-0.5 active:scale-95">Read the docs</Link>
      </main>
    </VariantShell>
  )
}
