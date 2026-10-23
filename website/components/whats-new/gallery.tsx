'use client'
import { apiExamples } from '../api/gallery'
import { cardFrom, Gallery, type GalleryItem } from '../gallery'
import { stylingExamples } from '../styling/gallery'
import { Try } from '../try'
import { archiveBoard } from './content'
import { QueueThree } from './queue'

const api = (id: string, label: string, change: string) => cardFrom(apiExamples, '/docs/api', id, label, change)
const styling = (id: string, label: string, change: string) => cardFrom(stylingExamples, '/docs/styling', id, label, change)

const releases: Record<'3.3' | '3.2' | '3.1', GalleryItem[]> = {
  '3.3': [
    styling('a-form-in-your-own-content', 'Plain HTML looks right', 'No class names'),
    api('dialoglayout', 'DialogLayout', 'Title, content and buttons'),
    {
      id: 'content-under-the-message',
      label: 'content',
      change: 'Your JSX in confirm, alert, prompt',
      Demo: () => <Try run={archiveBoard}>Archive</Try>,
      picture: {
        kind: 'confirm',
        title: 'Archive “Launch” board?',
        content: <p>12 cards move to the archive with it.</p>,
        buttons: [{ label: 'Cancel' }, { label: 'Archive', variant: 'primary' }],
      },
    },
  ],
  '3.2': [
    api('confirm', 'A new default look', 'Clear button order, danger tone'),
    styling('dark-mode', 'Dark mode', 'A class on <html>'),
    styling('brand-colour', 'Hover follows your colour', '3.2.1'),
  ],
  '3.1': [
    api('prompt', 'Promise API', 'await the answer'),
    api('dialog', '<Dialog> in place', 'Reads your state'),
    {
      id: 'queue-and-stack',
      label: 'Queue',
      change: "strategy: 'queue'",
      Demo: QueueThree,
      picture: {
        kind: 'alert',
        title: 'One',
        buttons: [{ label: 'OK', variant: 'primary' }],
      },
    },
  ],
}

export function ReleaseGallery({ version }: { version: keyof typeof releases }) {
  return <Gallery items={releases[version]} />
}
