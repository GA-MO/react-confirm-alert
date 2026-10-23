'use client'
import { apiExamples } from '../api/gallery'
import { cardFrom, Gallery, type GalleryItem } from '../gallery'
import { stylingExamples } from '../styling/gallery'
import { Try } from '../try'
import { archiveBoard } from './content'
import { pickTopic } from './plain-html'
import { QueueThree } from './queue'

// Each card links to its own heading in content/docs/whats-new.mdx.
const releases: Record<'3.3' | '3.2' | '3.1', GalleryItem[]> = {
  '3.3': [
    {
      id: 'plain-html-gets-the-default-look',
      label: 'Plain HTML looks right',
      change: 'No class names',
      Demo: () => <Try run={pickTopic}>Send feedback</Try>,
      picture: {
        kind: 'custom',
        title: 'Send feedback',
        content: (
          <>
            <label>Topic</label>
            <select><option>Bug</option></select>
          </>
        ),
        buttons: [{ label: 'Send', variant: 'primary' }],
      },
    },
    cardFrom(apiExamples, 'dialoglayout', { href: '#dialoglayout', label: 'DialogLayout', change: 'Title, content and buttons' }),
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
    cardFrom(apiExamples, 'confirm', { href: '#a-new-default-look', label: 'A new default look', change: 'Clear button order, danger tone' }),
    cardFrom(stylingExamples, 'dark-mode', { href: '#dark-mode-when-you-turn-it-on', label: 'Dark mode', change: 'A class on <html>' }),
    cardFrom(stylingExamples, 'brand-colour', { href: '#hover-colours-you-can-set', label: 'Hover follows your colour', change: 'Darker on hover, from 3.2.1' }),
  ],
  '3.1': [
    cardFrom(apiExamples, 'prompt', { href: '#promise-api', label: 'Promise API', change: 'await the answer' }),
    cardFrom(apiExamples, 'confirmdialog', { href: '#dialogs-in-your-tree', label: '<ConfirmDialog> in place', change: 'Reads your state' }),
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
