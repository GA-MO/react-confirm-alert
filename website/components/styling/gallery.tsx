'use client'
import type { ComponentType, ReactNode } from 'react'
import type { DialogKind, DialogSlot, StyleOptions } from 'react-confirm-alert'
import { BrandColor } from './brand-color'
import { Compact } from './compact'
import { DarkMode } from './dark-mode'
import { FeedbackForm } from './feedback-form'
import { FullWidthButtons } from './full-width-buttons'
import { IconTitle, WarningIcon } from './icon-title'
import { RoundCorners } from './round-corners'
import { SharpCorners } from './sharp-corners'
import { classNames as tailwindClassNames, TailwindOnly } from './tailwind-only'

interface Picture extends StyleOptions {
  kind: DialogKind
  tone?: 'danger'
  dark?: boolean
  title: ReactNode
  message?: string
  content?: ReactNode
  buttons: { label: string, variant?: 'primary' | 'danger' }[]
}

const cancel = { label: 'Cancel' }

// Same order and anchors as the Examples headings in content/docs/styling.mdx.
// Each picture repeats its example's options, so the card shows the dialog the button opens.
const examples: { id: string, label: string, change: string, Demo: ComponentType, picture: Picture }[] = [
  {
    id: 'brand-colour',
    label: 'Brand colour',
    change: '1 variable',
    Demo: BrandColor,
    picture: {
      kind: 'confirm',
      title: 'Publish this post?',
      message: 'It goes live for everyone right away.',
      buttons: [cancel, { label: 'Publish', variant: 'primary' }],
      classNames: { dialog: 'dialog-brand' },
    },
  },
  {
    id: 'round-corners',
    label: 'Round corners',
    change: '2 variables',
    Demo: RoundCorners,
    picture: {
      kind: 'alert',
      title: 'Saved',
      message: 'Your changes are live.',
      buttons: [{ label: 'OK', variant: 'primary' }],
      classNames: { dialog: 'dialog-round' },
    },
  },
  {
    id: 'sharp-corners',
    label: 'Sharp corners',
    change: '2 variables',
    Demo: SharpCorners,
    picture: {
      kind: 'confirm',
      title: 'Archive 12 files?',
      message: 'You can restore them from the archive.',
      buttons: [cancel, { label: 'Archive', variant: 'primary' }],
      classNames: { dialog: 'dialog-sharp' },
    },
  },
  {
    id: 'compact',
    label: 'Compact',
    change: '3 variables',
    Demo: Compact,
    picture: {
      kind: 'prompt',
      title: 'New folder',
      content: (
        <div data-slot="field">
          <label data-slot="label">Name</label>
          <input data-slot="input" defaultValue="Untitled" />
        </div>
      ),
      buttons: [cancel, { label: 'OK', variant: 'primary' }],
      classNames: { dialog: 'dialog-compact' },
    },
  },
  {
    id: 'dark-mode',
    label: 'Dark mode',
    change: 'A class on <html>',
    Demo: DarkMode,
    picture: {
      kind: 'custom',
      dark: true,
      title: 'Sign out?',
      message: 'You can sign back in at any time.',
      buttons: [cancel, { label: 'Sign out', variant: 'primary' }],
    },
  },
  {
    id: 'full-width-buttons',
    label: 'Full-width buttons',
    change: '1 class',
    Demo: FullWidthButtons,
    picture: {
      kind: 'confirm',
      title: 'Leave without saving?',
      message: 'Your edits on this page will be lost.',
      buttons: [{ label: 'Stay' }, { label: 'Leave', variant: 'primary' }],
      classNames: { button: 'button-fill' },
    },
  },
  {
    id: 'icon-before-the-title',
    label: 'Icon before the title',
    change: 'A React node',
    Demo: IconTitle,
    picture: {
      kind: 'confirm',
      tone: 'danger',
      title: <span className="title-icon"><WarningIcon /> Delete project?</span>,
      message: 'This deletes acme-web and all of its deploys.',
      buttons: [cancel, { label: 'Delete', variant: 'danger' }],
    },
  },
  {
    id: 'a-form-in-your-own-content',
    label: 'A form',
    change: 'Plain HTML',
    Demo: FeedbackForm,
    picture: {
      kind: 'custom',
      title: 'Send feedback',
      content: (
        <>
          <label>Topic</label>
          <select><option>Bug</option></select>
          <label>Details</label>
          <textarea />
          <label><input type="checkbox" defaultChecked /> You can email me about this</label>
        </>
      ),
      buttons: [cancel, { label: 'Send', variant: 'primary' }],
    },
  },
  {
    id: 'tailwind-only',
    label: 'Tailwind only',
    change: 'unstyled + classNames',
    Demo: TailwindOnly,
    picture: {
      kind: 'confirm',
      title: 'Invite 3 people?',
      message: 'They get an email with a link to join.',
      buttons: [cancel, { label: 'Send invites', variant: 'primary' }],
      unstyled: true,
      classNames: tailwindClassNames,
    },
  },
]

// The class names the library adds per slot (src/classNames.ts), left out with unstyled.
const builtIn: Partial<Record<DialogSlot, string>> = {
  dialog: 'react-confirm-alert-overlay',
  panel: 'react-confirm-alert',
  body: 'react-confirm-alert-body',
  actions: 'react-confirm-alert-button-group',
}

// The markup an open modal dialog renders (src/DialogFrame.tsx, src/api.tsx), drawn small by
// .dialog-thumbnail in app/global.css. Inert and hidden: the button under it opens the real one.
function DialogThumbnail({ kind, tone, dark, title, message, content, buttons, unstyled, classNames }: Picture) {
  const slot = (name: DialogSlot) => ({
    className: [unstyled ? undefined : builtIn[name], classNames?.[name]].filter(Boolean).join(' ') || undefined,
    'data-slot': name,
  })
  return (
    <div className="dialog-thumbnail" inert aria-hidden>
      <div data-theme={dark ? 'dark' : undefined}>
        <dialog open {...slot('dialog')} data-rca="" data-state="open" data-kind={kind} data-skin="" data-tone={tone ?? 'default'}>
          <div {...slot('panel')}>
            <div {...slot('body')}>
              <h1 {...slot('title')}>{title}</h1>
              {message && <p {...slot('message')}>{message}</p>}
              {content}
              <div {...slot('actions')}>
                {buttons.map(({ label, variant = 'secondary' }) => (
                  <button key={label} type="button" {...slot('button')} data-variant={variant}>{label}</button>
                ))}
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}

export function StylingGallery() {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {examples.map(({ id, label, change, Demo, picture }) => (
        <div key={id} className="flex flex-col gap-3 rounded-xl border bg-fd-card p-3">
          <DialogThumbnail {...picture} />
          <div className="gallery-tile flex flex-col items-start gap-3 px-1 pb-1">
            <a href={`#${id}`} className="hover:underline">
              <span className="block text-sm font-medium text-fd-foreground">{label}</span>
              <span className="block text-xs text-fd-muted-foreground">{change}</span>
            </a>
            <Demo />
          </div>
        </div>
      ))}
    </div>
  )
}
