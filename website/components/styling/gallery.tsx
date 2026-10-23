'use client'
import type { ComponentType } from 'react'
import { BrandColor } from './brand-color'
import { Compact } from './compact'
import { DarkMode } from './dark-mode'
import { FeedbackForm } from './feedback-form'
import { FullWidthButtons } from './full-width-buttons'
import { IconTitle } from './icon-title'
import { RoundCorners } from './round-corners'
import { SharpCorners } from './sharp-corners'
import { TailwindOnly } from './tailwind-only'

// Same order and anchors as the Examples headings in content/docs/styling.mdx.
const examples: { id: string, label: string, change: string, Demo: ComponentType }[] = [
  { id: 'brand-colour', label: 'Brand colour', change: '1 variable', Demo: BrandColor },
  { id: 'round-corners', label: 'Round corners', change: '2 variables', Demo: RoundCorners },
  { id: 'sharp-corners', label: 'Sharp corners', change: '2 variables', Demo: SharpCorners },
  { id: 'compact', label: 'Compact', change: '3 variables', Demo: Compact },
  { id: 'dark-mode', label: 'Dark mode', change: 'A class on <html>', Demo: DarkMode },
  { id: 'full-width-buttons', label: 'Full-width buttons', change: '1 class', Demo: FullWidthButtons },
  { id: 'icon-before-the-title', label: 'Icon before the title', change: 'A React node', Demo: IconTitle },
  { id: 'a-form-in-your-own-content', label: 'A form', change: 'Plain HTML', Demo: FeedbackForm },
  { id: 'tailwind-only', label: 'Tailwind only', change: 'unstyled + classNames', Demo: TailwindOnly },
]

export function StylingGallery() {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {examples.map(({ id, label, change, Demo }) => (
        <div key={id} className="gallery-tile flex flex-col items-start gap-3 rounded-xl border bg-fd-card p-4">
          <a href={`#${id}`} className="hover:underline">
            <span className="block text-sm font-medium text-fd-foreground">{label}</span>
            <span className="block text-xs text-fd-muted-foreground">{change}</span>
          </a>
          <Demo />
        </div>
      ))}
    </div>
  )
}
