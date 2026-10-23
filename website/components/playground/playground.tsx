'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { alert, closeAll, configureDialogs, confirm, confirmAlert, Dialog, openDialog, prompt } from 'react-confirm-alert'

type Log = { id: number, scenario: string, text: string }
type Options = { title: string, message: string, danger: boolean, modal: boolean, closeOnEscape: boolean, closeOnClickOutside: boolean }
type Run = (o: Options, log: (text: string) => void, go: (path: string) => void) => void | Promise<void>
interface Scenario { id: string, label: string, group: string, code: string, run?: Run, inline?: true }

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
const base = (o: Options) => ({ title: o.title, message: o.message, modal: o.modal, closeOnEscape: o.closeOnEscape, closeOnClickOutside: o.closeOnClickOutside })

const scenarios: Scenario[] = [
  { id: 'confirm', group: 'Promise API', label: 'await confirm()', code: "if (await confirm({ title, message, tone })) remove()", run: async (o, log) => log(`resolved ${await confirm({ ...base(o), tone: o.danger ? 'danger' : 'default' })}`) },
  { id: 'alert', group: 'Promise API', label: 'alert()', code: "await alert({ title, message })", run: async (o, log) => { await alert(base(o)); log('resolved') } },
  { id: 'prompt', group: 'Promise API', label: 'prompt() with validate', code: "const name = await prompt({ title: 'Your name', validate: (v) => v ? null : 'Required' })", run: async (o, log) => log(`resolved ${JSON.stringify(await prompt({ ...base(o), title: 'Your name', label: 'Name', validate: (v) => (v.trim() ? null : 'Required') }))}`) },
  { id: 'async', group: 'Promise API', label: 'Async button', code: "await confirm({ title: 'Save?', onConfirm: () => save() }) // busy until save() settles", run: async (o, log) => log(`resolved ${await confirm({ ...base(o), title: 'Save changes?', confirmLabel: 'Save', onConfirm: () => wait(1500) })}`) },
  { id: 'stack', group: 'Several dialogs', label: 'Nested (stack)', code: "openDialog({ render: () => <button onClick={() => confirm('Sure?')}>Next</button> })", run: (o, log) => { openDialog({ ...base(o), title: undefined, render: ({ dismiss }) => <Inner dismiss={dismiss} log={log} /> }) } },
  { id: 'queue', group: 'Several dialogs', label: 'Queue', code: "alert({ title: 'One', strategy: 'queue' }); alert({ title: 'Two', strategy: 'queue' })", run: async (o, log) => { for (const t of ['One', 'Two', 'Three']) void alert({ ...base(o), title: t, message: 'Opens after the one before closes.', strategy: 'queue' }).then(() => log(`${t} closed`)) } },
  { id: 'closeAll', group: 'Several dialogs', label: 'closeAll()', code: "setTimeout(closeAll, 1500)", run: async (o, log) => { void confirm({ ...base(o), title: 'Closing in 1.5 s' }).then((r) => log(`resolved ${r}`)); await wait(1500); closeAll() } },
  { id: 'route', group: 'Several dialogs', label: 'Close on navigation', code: "<DialogHost dismissKey={usePathname()} />", run: async (o, log, go) => { void confirm({ ...base(o), title: 'Navigating in 1.5 s' }).then((r) => log(`resolved ${r}`)); await wait(1500); go('/docs/recipes/next-app-router') } },
  { id: 'inline', group: 'In your tree', label: '<Dialog open> with state', code: "<Dialog open={open} onOpenChange={setOpen}><textarea value={note} onChange={...} /></Dialog>", inline: true },
  { id: 'custom', group: 'In your tree', label: 'openDialog() typed result', code: "const { result } = openDialog<string>({ render: ({ close }) => <button onClick={() => close('blue')}>Blue</button> })", run: async (o, log) => { const { result } = openDialog<string>({ ...base(o), render: ({ close }) => <Colors close={close} /> }); log(`resolved ${JSON.stringify(await result)}`) } },
  { id: 'v3', group: 'v3 API', label: 'confirmAlert()', code: "confirmAlert({ title, message, buttons: [{ label: 'Yes', onClick }, { label: 'No' }] })", run: (o, log) => confirmAlert({ title: o.title, message: o.message, closeOnEscape: o.closeOnEscape, closeOnClickOutside: o.closeOnClickOutside, buttons: [{ label: 'Yes', onClick: () => log('Yes') }, { label: 'No', onClick: () => log('No') }] }) },
  { id: 'customUI', group: 'v3 API', label: 'customUI', code: "confirmAlert({ customUI: ({ onClose }) => <div className='custom-ui'>…</div> })", run: (o, log) => confirmAlert({ customUI: ({ onClose }) => <div className="rounded-xl bg-fd-card p-6 shadow-xl"><h2 className="mb-4 text-lg font-semibold">Custom UI</h2><button className="rounded-md border px-3 py-1.5" onClick={() => { log('custom closed'); onClose() }}>Close</button></div> }) }
]

const styles = {
  default: { label: 'Default CSS', apply: () => configureDialogs({}) },
  variables: { label: 'CSS variables', apply: () => configureDialogs({}) },
  mixed: { label: 'Tailwind + default', apply: () => configureDialogs({ classNames: { button: 'rounded-full transition active:scale-95 data-[variant=primary]:bg-fd-primary data-[variant=primary]:text-fd-primary-foreground' } }) },
  tailwind: {
    label: 'Tailwind only',
    apply: () => configureDialogs({
      unstyled: true,
      classNames: {
        dialog: 'fixed inset-0 m-0 open:grid size-full max-h-none max-w-none place-items-center bg-transparent p-4 backdrop:bg-black/40 backdrop:backdrop-blur-sm',
        panel: 'w-full max-w-md rounded-2xl border bg-fd-card p-6 text-fd-card-foreground shadow-2xl transition duration-150 starting:scale-95 starting:opacity-0 in-data-[state=closing]:scale-95 in-data-[state=closing]:opacity-0 motion-reduce:transition-none',
        title: 'text-lg font-semibold', message: 'mt-2 whitespace-pre-line text-sm text-fd-muted-foreground',
        field: 'mt-4 grid gap-1 text-sm', input: 'rounded-md border bg-transparent px-3 py-2 aria-invalid:border-red-500', error: 'text-xs text-red-500',
        actions: 'mt-6 flex justify-end gap-2',
        button: 'rounded-md border px-3 py-1.5 text-sm font-medium transition active:scale-95 data-[variant=primary]:border-transparent data-[variant=primary]:bg-fd-primary data-[variant=primary]:text-fd-primary-foreground data-[variant=danger]:bg-red-600 data-[variant=danger]:text-white disabled:opacity-60 aria-busy:animate-pulse'
      }
    })
  }
} as const
type StyleKey = keyof typeof styles

function Inner ({ dismiss, log }: { dismiss: () => void, log: (t: string) => void }) {
  return (
    <div className="react-confirm-alert-body">
      <h1>Level 1</h1>
      <p>Open a second dialog on top. Escape closes the top one first.</p>
      <div className="react-confirm-alert-button-group">
        <button onClick={async () => log(`level 2 resolved ${await confirm('Level 2')}`)}>Open level 2</button>
        <button onClick={dismiss}>Close</button>
      </div>
    </div>
  )
}

function Colors ({ close }: { close: (v: string) => void }) {
  return (
    <div className="react-confirm-alert-body">
      <h1>Pick a colour</h1>
      <div className="react-confirm-alert-button-group">
        {['red', 'green', 'blue'].map((c) => <button key={c} onClick={() => close(c)}>{c}</button>)}
      </div>
    </div>
  )
}

function Toggle ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
      {label}
      <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${checked ? 'bg-fd-primary' : 'bg-fd-muted-foreground/30'}`}>
        <span className={`block size-4 rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4 bg-fd-primary-foreground' : 'translate-x-0 bg-white'}`} />
      </button>
    </label>
  )
}

export function Playground () {
  const router = useRouter()
  const [active, setActive] = useState('confirm')
  const [opts, setOpts] = useState<Options>({ title: 'Delete file?', message: 'This cannot be undone.', danger: false, modal: true, closeOnEscape: true, closeOnClickOutside: true })
  const [style, setStyle] = useState<StyleKey>('default')
  const [width, setWidth] = useState(400)
  const [logs, setLogs] = useState<Log[]>([])
  const [copied, setCopied] = useState(false)
  const [inlineOpen, setInlineOpen] = useState(false)
  const [note, setNote] = useState('')
  const scenario = scenarios.find((s) => s.id === active)!

  useEffect(() => { styles[style].apply() }, [style])
  useEffect(() => () => configureDialogs({}), [])
  useEffect(() => {
    const root = document.documentElement.style
    if (style === 'variables') root.setProperty('--rca-width', `${width}px`)
    else root.removeProperty('--rca-width')
  }, [style, width])

  const log = (text: string) => setLogs((l) => [{ id: Date.now() + Math.random(), scenario: scenario.label, text }, ...l].slice(0, 8))
  const run = () => (scenario.inline ? setInlineOpen(true) : void scenario.run?.(opts, log, (p) => router.push(p)))
  const set = <K extends keyof Options>(k: K) => (v: Options[K]) => setOpts((o) => ({ ...o, [k]: v }))
  const groups = [...new Set(scenarios.map((s) => s.group))]

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-8 md:grid-cols-[220px_1fr] md:px-6">
      <label className="flex flex-col gap-1.5 text-sm font-medium md:hidden">
        Scenario
        <select value={active} onChange={(e) => setActive(e.target.value)} className="h-11 w-full cursor-pointer rounded-lg border bg-fd-background px-3 text-base shadow-sm transition focus:border-fd-primary focus:outline-none">
          {groups.map((g) => (
            <optgroup key={g} label={g}>
              {scenarios.filter((s) => s.group === g).map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <nav aria-label="Scenarios" className="hidden flex-col md:flex">
        {groups.map((g) => (
          <div key={g}>
            <p className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">{g}</p>
            {scenarios.filter((s) => s.group === g).map((s) => (
              <button key={s.id} onClick={() => setActive(s.id)} aria-current={s.id === active}
                className="block w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-sm transition-colors duration-150 hover:bg-fd-accent aria-[current=true]:bg-fd-card aria-[current=true]:font-medium aria-[current=true]:shadow-sm aria-[current=true]:ring-1 aria-[current=true]:ring-black/5">
                {s.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <section className="flex min-w-0 flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{scenario.label}</h1>
          <button onClick={run} className="cursor-pointer rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground shadow-sm transition duration-150 ease-out-quint hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-97">Open dialog</button>
        </header>
        <div className="relative rounded-xl border bg-fd-secondary/50 p-4 font-mono text-sm">
          <pre className="overflow-x-auto whitespace-pre-wrap pr-16">{scenario.code}</pre>
          <button onClick={async () => { await navigator.clipboard?.writeText(scenario.code); setCopied(true); setTimeout(() => setCopied(false), 1200) }}
            className="absolute right-3 top-3 rounded-md border bg-fd-background px-2 py-1 text-xs transition active:scale-95">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <fieldset className="flex flex-col gap-3 rounded-2xl bg-fd-card p-6 shadow-sm ring-1 ring-black/5">
            <legend className="float-left mb-1 w-full text-sm font-semibold">Options</legend>
            <Field label="Title"><input value={opts.title} onChange={(e) => set('title')(e.target.value)} className="w-full rounded-md border bg-transparent px-2 py-1.5 text-sm" /></Field>
            <Field label="Message"><input value={opts.message} onChange={(e) => set('message')(e.target.value)} className="w-full rounded-md border bg-transparent px-2 py-1.5 text-sm" /></Field>
            <Toggle label="tone: danger" checked={opts.danger} onChange={set('danger')} />
            <Toggle label="modal (native <dialog>)" checked={opts.modal} onChange={set('modal')} />
            <Toggle label="closeOnEscape" checked={opts.closeOnEscape} onChange={set('closeOnEscape')} />
            <Toggle label="closeOnClickOutside" checked={opts.closeOnClickOutside} onChange={set('closeOnClickOutside')} />
          </fieldset>
          <fieldset className="flex flex-col gap-3 rounded-2xl bg-fd-card p-6 shadow-sm ring-1 ring-black/5">
            <legend className="float-left mb-1 w-full text-sm font-semibold">Styling</legend>
            <div role="radiogroup" className="grid grid-cols-2 gap-2">
              {(Object.keys(styles) as StyleKey[]).map((k) => (
                <button key={k} role="radio" aria-checked={style === k} onClick={() => setStyle(k)}
                  className="rounded-lg border px-2 py-1.5 text-sm transition hover:bg-fd-accent active:scale-97 aria-checked:border-fd-primary aria-checked:bg-fd-primary/10">
                  {styles[k].label}
                </button>
              ))}
            </div>
            {style === 'variables' && (
              <Field label={`--rca-width: ${width}px`}><input type="range" min={280} max={640} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-[var(--color-fd-primary)]" /></Field>
            )}
            <p className="text-xs text-fd-muted-foreground">Styling applies to the Promise API and dialogs in your tree. confirmAlert keeps the v3 look unless configureDialogs sets confirmAlert defaults.</p>
          </fieldset>
        </div>
        <div aria-live="polite" className="rounded-2xl bg-fd-card p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-2 text-sm font-semibold">Results</h2>
          {logs.length === 0
            ? <p className="text-sm text-fd-muted-foreground">Open a dialog. What it resolves with shows up here.</p>
            : <ul className="flex flex-col gap-1 font-mono text-sm">{logs.map((l) => <li key={l.id} className="transition duration-300 starting:-translate-y-1 starting:opacity-0"><span className="text-fd-muted-foreground">{l.scenario}:</span> {l.text}</li>)}</ul>}
        </div>
      </section>
      <Dialog open={inlineOpen} onOpenChange={setInlineOpen} aria-label="Edit note">
        <div className="react-confirm-alert-body">
          <h1>Edit note</h1>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full rounded-md border p-2" placeholder="Type, and the Save button follows the parent state" />
          <div className="react-confirm-alert-button-group">
            <button disabled={!note.trim()} onClick={() => { log(`saved "${note}"`); setInlineOpen(false) }}>Save</button>
            <button onClick={() => setInlineOpen(false)}>Cancel</button>
          </div>
        </div>
      </Dialog>
    </main>
  )
}

function Field ({ label, children }: { label: string, children: ReactNode }) {
  return <label className="flex flex-col gap-1 text-sm">{label}{children}</label>
}
