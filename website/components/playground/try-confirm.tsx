'use client'
import { useState } from 'react'
import { confirm } from 'react-confirm-alert'

export function TryConfirm () {
  const [answer, setAnswer] = useState<boolean | null>(null)
  return (
    <button
      className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground transition hover:opacity-90 active:scale-[0.97]"
      onClick={async () => setAnswer(await confirm({ title: 'Like it?', message: 'This is confirm() in a native modal.' }))}
    >
      Try confirm(){answer !== null && <span className="ml-2 opacity-80">→ {String(answer)}</span>}
    </button>
  )
}
