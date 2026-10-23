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

// Copy and proof on the left, the live dialog on the right.
export function Home({ stats }: { stats: HomeStats }) {
  const [theme, setTheme] = useState(themes[0]!)
  useTheme(theme)
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-24 px-6 py-16 md:py-24">
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <p className={`${enter} text-sm font-medium text-indigo-600 dark:text-indigo-400`} style={rise(0)}>For React 18 and 19</p>
          <h1 className={`${enter} text-balance text-5xl font-semibold tracking-tight text-fd-foreground sm:text-6xl`} style={rise(1)}>Ask, then wait for the answer.</h1>
          <p className={`${enter} max-w-md text-pretty text-lg text-fd-muted-foreground`} style={rise(2)}>
            <code className="rounded-md bg-fd-muted px-1.5 py-0.5 text-base text-fd-foreground">await confirm()</code> opens a real dialog and resolves true or false. Style it with CSS, Tailwind or nothing at all.
          </p>
          <div className={`${enter} flex flex-col gap-3 sm:flex-row sm:items-center`} style={rise(3)}>
            <Install />
            <Link href="/docs" className="cursor-pointer rounded-xl px-4 py-2.5 text-center text-sm font-medium text-fd-foreground ring-1 ring-fd-border transition duration-200 hover:bg-fd-accent active:scale-97 motion-reduce:transition-none">Read the docs</Link>
          </div>
          <Stats stats={stats} className={`${enter} mt-4 border-t pt-6`} />
        </div>
        <div className={`${enter} flex min-w-0 flex-col gap-3 rounded-3xl border bg-fd-card p-3 shadow-xl shadow-zinc-950/5`} style={rise(2)}>
          <ThemePicker theme={theme} onChange={setTheme} />
          <Stage theme={theme} className="h-80 rounded-2xl border bg-fd-background" />
          <Snippet theme={theme} />
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-fd-foreground">Your own UI, the same await</h2>
        <p className="text-fd-muted-foreground">Forms, lists and checks in plain HTML. Each one resolves what it closes with.</p>
        <CustomRow />
      </section>
    </main>
  )
}
