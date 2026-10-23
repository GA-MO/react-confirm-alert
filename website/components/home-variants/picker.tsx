'use client'
import { themes, type Theme } from './themes'

// Five equal columns, so the highlight slides by whole widths to the picked chip.
export function ThemePicker({ theme, onChange }: { theme: Theme, onChange: (theme: Theme) => void }) {
  const index = themes.indexOf(theme)
  return (
    <div role="radiogroup" aria-label="Dialog theme" className="relative grid grid-cols-5 rounded-full bg-fd-muted p-1 text-xs sm:text-sm">
      <span aria-hidden className="pointer-events-none absolute inset-1 grid grid-cols-5">
        <span
          className="rounded-full bg-fd-background shadow-sm ring-1 ring-zinc-950/5 transition-transform duration-300 ease-out-quint motion-reduce:transition-none dark:ring-white/10"
          style={{ transform: `translateX(${index * 100}%)` }}
        />
      </span>
      {themes.map((t) => (
        <button
          key={t.id}
          role="radio"
          aria-checked={t === theme}
          onClick={() => onChange(t)}
          className="relative flex cursor-pointer items-center justify-center gap-1 rounded-full px-1 py-1.5 sm:gap-1.5 sm:px-2 text-fd-muted-foreground transition-colors duration-200 hover:text-fd-foreground active:scale-97 aria-checked:text-fd-foreground motion-reduce:transition-none"
        >
          <span aria-hidden className={`size-2 shrink-0 ${t.dot}`} />
          {t.label}
        </button>
      ))}
    </div>
  )
}
