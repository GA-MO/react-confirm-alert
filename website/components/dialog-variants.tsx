'use client'
import { useEffect, useState } from 'react'
import { alert, configureDialogs, confirm, prompt } from 'react-confirm-alert'
import { basePath } from '@/lib/shared'

// Candidate default looks for confirm, alert and prompt. Each is a stylesheet in public/variants/dialog,
// written as it would ship in the library, so its gzip size is the real cost.
const variants = {
  quiet: { name: 'Quiet', note: 'Linear-like. Hairline border, soft shadow, compact buttons.' },
  sharp: { name: 'Sharp', note: 'Vercel/Geist-like. Crisp edges, footer strip, Cancel left.' },
  soft: { name: 'Soft', note: 'Radix/shadcn-like. Zoom-in, outline secondary, offset ring.' }
} as const
type Variant = keyof typeof variants

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const demos: { label: string, run: () => Promise<unknown> }[] = [
  { label: 'Confirm', run: () => confirm({ title: 'Publish this post?', message: 'Subscribers get an email right away.', confirmLabel: 'Publish' }) },
  { label: 'Danger confirm', run: () => confirm({ title: 'Delete “Q3 report.pdf”?', message: 'It moves to the trash for 30 days.', tone: 'danger', confirmLabel: 'Delete' }) },
  { label: 'Alert', run: () => alert({ title: 'Changes saved', message: 'Your profile is up to date.' }) },
  { label: 'Prompt', run: () => prompt({ title: 'Rename project', label: 'Project name', defaultValue: 'Launch plan', submitLabel: 'Rename', validate: (v) => (v.trim() ? null : 'Give the project a name') }) },
  { label: 'Busy button', run: () => confirm({ title: 'Archive 24 files?', message: 'The button waits for the request to finish.', confirmLabel: 'Archive', onConfirm: () => wait(2500) }) }
]

export function DialogVariants () {
  const [variant, setVariant] = useState<Variant>('quiet')
  const [result, setResult] = useState('')

  // ?v= picks the variant on load, so a screenshot script can open each one directly.
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('v')
    if (v && v in variants) setVariant(v as Variant)
    configureDialogs({})
  }, [])

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `${basePath}/variants/dialog/${variant}.css`
    link.dataset.dialogVariant = variant
    document.head.append(link)
    return () => link.remove()
  }, [variant])

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Dialog variants</h1>
      <p className="mt-3 text-pretty text-zinc-600">Three candidate default looks for <code>confirm</code>, <code>alert</code> and <code>prompt</code>. <code>confirmAlert</code> keeps the 3.0 look in all of them.</p>
      <div role="radiogroup" aria-label="Variant" className="mt-8 grid gap-2 sm:grid-cols-3">
        {(Object.keys(variants) as Variant[]).map((k) => (
          <button key={k} role="radio" aria-checked={variant === k} onClick={() => setVariant(k)}
            className="cursor-pointer rounded-xl bg-white p-4 text-left ring-1 ring-zinc-200 transition duration-150 hover:ring-zinc-300 active:scale-98 aria-checked:ring-2 aria-checked:ring-zinc-950">
            <span className="block text-sm font-semibold text-zinc-950">{variants[k].name}</span>
            <span className="mt-1 block text-sm text-zinc-500">{variants[k].note}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {demos.map((d) => (
          <button key={d.label} onClick={async () => setResult(`${d.label} → ${JSON.stringify(await d.run()) ?? 'undefined'}`)}
            className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-800 ring-1 ring-zinc-200 transition duration-150 hover:bg-zinc-50 active:scale-97">
            {d.label}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-6 min-h-6 font-mono text-sm text-zinc-600">{result}</p>
    </main>
  )
}
