'use client'
import { useState } from 'react'

const command = 'npm i react-confirm-alert'

export function Install({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  // Says Copied only when the clipboard took it; a refused write leaves the button as it was.
  const copy = () =>
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }, () => {})
  return (
    <div className={`flex items-center gap-2 text-left rounded-xl border bg-fd-card py-1.5 pl-4 pr-1.5 font-mono text-sm shadow-sm ${className}`}>
      <span aria-hidden className="select-none text-fd-muted-foreground">$</span>
      <code className="flex-1 whitespace-nowrap">{command}</code>
      <button
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy install command'}
        className="relative grid size-8 cursor-pointer place-items-center rounded-lg text-fd-muted-foreground transition duration-200 hover:bg-fd-accent hover:text-fd-foreground active:scale-90 motion-reduce:transition-none"
      >
        <svg aria-hidden viewBox="0 0 24 24" className={`col-start-1 row-start-1 size-4 transition duration-200 motion-reduce:transition-none ${copied ? 'scale-50 opacity-0' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
        <svg aria-hidden viewBox="0 0 24 24" className={`col-start-1 row-start-1 size-4 text-emerald-600 transition duration-200 motion-reduce:transition-none dark:text-emerald-400 ${copied ? '' : 'scale-50 opacity-0'}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      </button>
      <span aria-live="polite" className="sr-only">{copied ? 'Copied' : ''}</span>
    </div>
  )
}
