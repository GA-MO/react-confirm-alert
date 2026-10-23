'use client'
import { useEffect, useRef, useState } from 'react'
import { ConfirmDialog } from 'react-confirm-alert'
import { question, type Theme } from './themes'

// Demo only: the hero renders ConfirmDialog in place, not modal, so the dialog opens inside this box
// over a small page, and a theme change restyles it while it is open. The snippet shows the confirm()
// call it mirrors.
const inPlace = 'absolute inset-0 grid place-items-center bg-zinc-950/40 p-4'

export function Stage({ theme, className = '' }: { theme: Theme, className?: string }) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<boolean>()
  const confirmed = useRef(false)
  const ask = () => { confirmed.current = false; setOpen(true) }
  // Picking a theme opens the dialog, so the change is visible; the first render keeps it closed.
  const shown = useRef(theme)
  useEffect(() => {
    if (shown.current === theme) return
    shown.current = theme
    if (!open) ask()
  }, [theme, open])
  const style = theme.classNames
    ? { unstyled: true, classNames: { ...theme.classNames, dialog: inPlace } }
    : {}
  return (
    <div className={`home-stage relative isolate grid transform-gpu place-items-center overflow-hidden p-6 ${className}`}>
      <article className="flex w-full max-w-xs flex-col gap-4 rounded-2xl bg-fd-card p-5 shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10">
        <header className="flex items-center justify-between">
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">Draft</span>
          <span className="text-xs text-fd-muted-foreground">Edited just now</span>
        </header>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-fd-foreground">Launch notes</h3>
          <span aria-hidden className="h-2 w-full rounded-full bg-fd-muted" />
          <span aria-hidden className="h-2 w-5/6 rounded-full bg-fd-muted" />
          <span aria-hidden className="h-2 w-2/3 rounded-full bg-fd-muted" />
        </div>
        <footer className="flex items-center justify-between gap-3">
          <output aria-live="polite" className="font-mono text-xs text-fd-muted-foreground">
            {result === undefined ? '' : `confirm() → ${result}`}
          </output>
          <button
            onClick={ask}
            className="cursor-pointer rounded-lg bg-fd-primary px-3.5 py-1.5 text-sm font-medium text-fd-primary-foreground shadow-sm transition duration-200 ease-out-quint hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-97 motion-reduce:transition-none"
          >
            Publish
          </button>
        </footer>
      </article>
      <ConfirmDialog
        kind="confirm"
        open={open}
        modal={false}
        onOpenChange={(next) => {
          if (!next) setResult(confirmed.current)
          setOpen(next)
        }}
        onConfirm={() => { confirmed.current = true }}
        {...question}
        {...style}
      />
    </div>
  )
}
