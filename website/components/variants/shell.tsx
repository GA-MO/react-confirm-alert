'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export const personalities = {
  a: { name: 'Calm & precise', note: 'A utility you stop noticing: neutral ink, one indigo accent, quiet 200 ms settles. The dialog is the product, so the page gets out of its way.' },
  b: { name: 'Friendly & springy', note: 'Warm and approachable: rounded shapes, soft colour, a small overshoot when things appear. Reads as "dialogs can be pleasant".' },
  c: { name: 'Developer tool', note: 'Code first: you see the call and its result side by side, like a REPL in light mode. Motion is fast and functional, never decorative.' }
} as const

export function VariantShell ({ id, children }: { id: keyof typeof personalities, children: ReactNode }) {
  const path = usePathname()
  return (
    <>
      {children}
      <aside className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-xl flex-col gap-2 rounded-2xl border bg-white/90 p-3 text-sm shadow-lg backdrop-blur sm:flex-row sm:items-center sm:gap-4">
        <div className="flex gap-1">
          {(['a', 'b', 'c'] as const).map((v) => (
            <Link key={v} href={`/variants/${v}`} aria-current={path.includes(`/variants/${v}`) || (v === id && !path.includes('/variants/'))}
              className="cursor-pointer rounded-lg px-3 py-1.5 font-medium uppercase text-zinc-500 transition duration-150 hover:bg-zinc-100 hover:text-zinc-900 aria-[current=true]:bg-zinc-900 aria-[current=true]:text-white">
              {v}
            </Link>
          ))}
        </div>
        <p className="text-zinc-600"><span className="font-semibold text-zinc-900">{personalities[id].name}.</span> {personalities[id].note}</p>
      </aside>
    </>
  )
}
