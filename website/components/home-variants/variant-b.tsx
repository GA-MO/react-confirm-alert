'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { HomeStats } from '@/lib/home-stats'
import { CustomRow } from './custom-row'
import { Install } from './install'
import { ThemePicker } from './picker'
import { Snippet } from './snippet'
import { Stage } from './stage'
import { Stats } from './stats'
import { themes } from './themes'
import { useTheme } from './use-theme'

const rise = (i: number) => ({ animationDelay: `${i * 70}ms` })
const enter = 'animate-rise motion-reduce:animate-none'

// B: a small playground. A short centred title, then one wide bench: themes, the live dialog, the code.
export function HomeB({ stats }: { stats: HomeStats }) {
  const [theme, setTheme] = useState(themes[0]!)
  useTheme(theme)
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-16 px-4 py-14 md:px-6 md:py-20">
      <section className="flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className={`${enter} whitespace-nowrap text-3xl font-semibold tracking-tight text-fd-foreground sm:text-6xl`} style={rise(0)}>react-confirm-alert</h1>
        <p className={`${enter} text-pretty text-lg text-fd-muted-foreground`} style={rise(1)}>Confirm, alert and prompt dialogs you <code className="rounded-md bg-fd-muted px-1.5 py-0.5 text-base text-fd-foreground">await</code>. Pick a theme below and the open dialog follows.</p>
        <div className={`${enter} flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row`} style={rise(2)}>
          <Install className="w-full sm:w-auto" />
          <Link href="/docs" className="cursor-pointer text-sm font-medium text-fd-foreground underline decoration-fd-border underline-offset-4 transition-colors hover:decoration-current">Documentation</Link>
        </div>
      </section>

      <section aria-label="Live dialog" className={`${enter} w-full rounded-3xl border bg-fd-card p-3 shadow-xl shadow-zinc-950/5`} style={rise(3)}>
        <div className="grid gap-3 lg:grid-cols-5">
          <div className="flex min-w-0 flex-col gap-3 lg:col-span-3">
            <ThemePicker theme={theme} onChange={setTheme} />
            <Stage theme={theme} className="home-dots h-96 rounded-2xl border bg-fd-background" />
          </div>
          <div className="min-w-0 lg:col-span-2">
            <Snippet theme={theme} />
          </div>
        </div>
      </section>

      <Stats stats={stats} className="w-full max-w-3xl text-center" />

      <section className="flex w-full flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-fd-foreground">Your own UI, the same await</h2>
        <p className="text-fd-muted-foreground">Press one. What it resolves to shows under its button.</p>
        <div className="w-full text-left">
          <CustomRow />
        </div>
      </section>
    </main>
  )
}
