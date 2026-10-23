'use client'
import Link from 'next/link'
import type { ComponentType, ReactNode } from 'react'
import type { DialogKind, DialogSlot, StyleOptions } from 'react-confirm-alert'

export interface Picture extends StyleOptions {
  kind: DialogKind
  tone?: 'danger'
  dark?: boolean
  /** confirmAlert without skin: the 3.0 markup, no data-skin and no button variants */
  legacy?: boolean
  title?: ReactNode
  message?: string
  content?: ReactNode
  buttons: { label: string, variant?: 'primary' | 'danger' }[]
}

export interface GalleryItem {
  /** the section heading's anchor, on this page unless href says otherwise */
  id: string
  href?: string
  label: string
  change: string
  Demo: ComponentType
  picture: Picture
}

// The class names the library adds per slot (src/classNames.ts), left out with unstyled.
const builtIn: Partial<Record<DialogSlot, string>> = {
  dialog: 'react-confirm-alert-overlay',
  panel: 'react-confirm-alert',
  body: 'react-confirm-alert-body',
  actions: 'react-confirm-alert-button-group',
}

// The markup an open dialog renders (src/DialogFrame.tsx, src/api.tsx), drawn small by
// .dialog-thumbnail in app/global.css. Inert and hidden: the button under it opens the real one.
export function DialogThumbnail({ kind, tone, dark, legacy, title, message, content, buttons, unstyled, classNames }: Picture) {
  const slot = (name: DialogSlot) => ({
    className: [unstyled ? undefined : builtIn[name], classNames?.[name]].filter(Boolean).join(' ') || undefined,
    'data-slot': name,
  })
  return (
    <div className="dialog-thumbnail" inert aria-hidden>
      <div data-theme={dark ? 'dark' : undefined}>
        <dialog open {...slot('dialog')} data-rca="" data-state="open" data-kind={kind} data-skin={legacy ? undefined : ''} data-tone={tone ?? 'default'}>
          <div {...slot('panel')}>
            <div {...slot('body')}>
              {title && <h1 {...slot('title')}>{title}</h1>}
              {message && (legacy ? message : <p {...slot('message')}>{message}</p>)}
              {content}
              <div {...slot('actions')}>
                {buttons.map(({ label, variant = 'secondary' }) => (
                  <button key={label} type="button" {...slot('button')} data-variant={legacy ? undefined : variant}>{label}</button>
                ))}
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}

// Three columns only when every row fills; two or four cards sit two by two.
export function Gallery({ items }: { items: readonly GalleryItem[] }) {
  return (
    <div className={`not-prose my-6 grid gap-3 sm:grid-cols-2 ${items.length % 3 === 0 ? 'lg:grid-cols-3' : ''}`}>
      {items.map(({ id, href = `#${id}`, label, change, Demo, picture }) => (
        <div key={id} className="flex flex-col gap-3 rounded-xl border bg-fd-card p-3">
          <DialogThumbnail {...picture} />
          <div className="gallery-tile flex flex-wrap items-center gap-x-2 gap-y-3 px-1 pb-1">
            <Link href={href} className="basis-full hover:underline">
              <span className="block text-sm font-medium text-fd-foreground">{label}</span>
              <span className="block text-xs text-fd-muted-foreground">{change}</span>
            </Link>
            <Demo />
          </div>
        </div>
      ))}
    </div>
  )
}
