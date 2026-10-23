'use client'
import { configureDialogs } from 'react-confirm-alert'
import { Gallery, type GalleryItem } from '../gallery'
import { Try } from '../try'
import { showSaved } from './alert'
import { askThenClose } from './close-all'
import { askInThai } from './configure-dialogs'
import { deleteFile } from './confirm'
import { SubmitOrder } from './confirm-alert'
import { LeavePage } from './confirm-dialog'
import { ShowTerms } from './custom-ui'
import { EditNote } from './dialog'
import { ShowTheme, ThemeName } from './dialog-host'
import { renameWorkspace } from './dialog-layout'
import { pickPlan } from './open-dialog'
import { renameFile } from './prompt'
import { publish } from './wait'

const cancel = { label: 'Cancel' }

// The preview resets the labels, so the Thai ones stay in this one example.
export const askInThaiOnce = () => askInThai().finally(() => configureDialogs({}))

// Same order and anchors as the headings in content/docs/api.mdx.
// Each picture repeats its example's options, so the card shows the dialog the button opens.
export const apiExamples: GalleryItem[] = [
  {
    id: 'confirm',
    label: 'confirm',
    change: 'Resolves true or false',
    Demo: () => <Try run={deleteFile}>Delete</Try>,
    picture: {
      kind: 'confirm',
      tone: 'danger',
      title: 'Delete “Q3 report.pdf”?',
      message: 'It moves to the trash for 30 days.',
      buttons: [cancel, { label: 'Delete', variant: 'danger' }],
    },
  },
  {
    id: 'alert',
    label: 'alert',
    change: 'Resolves when closed',
    Demo: () => <Try run={showSaved}>Save</Try>,
    picture: {
      kind: 'alert',
      title: 'Saved',
      message: 'Your changes are safe.',
      buttons: [{ label: 'OK', variant: 'primary' }],
    },
  },
  {
    id: 'prompt',
    label: 'prompt',
    change: 'Resolves the text or null',
    Demo: () => <Try run={renameFile}>Rename</Try>,
    picture: {
      kind: 'prompt',
      title: 'Rename file',
      content: (
        <div data-slot="field">
          <input data-slot="input" defaultValue="Q3 report.pdf" />
        </div>
      ),
      buttons: [cancel, { label: 'OK', variant: 'primary' }],
    },
  },
  {
    id: 'opendialog',
    label: 'openDialog',
    change: 'Resolves what you pass to close()',
    Demo: () => <Try run={pickPlan}>Pick a plan</Try>,
    picture: {
      kind: 'custom',
      title: 'Pick a plan',
      message: 'You can change it at any time.',
      buttons: [{ label: 'Free' }, { label: 'Pro' }, { label: 'Team' }],
    },
  },
  {
    id: 'closedialog-and-closeall',
    label: 'closeAll',
    change: 'Dismisses every dialog',
    Demo: () => <Try run={askThenClose}>Open</Try>,
    picture: {
      kind: 'confirm',
      title: 'This closes in 2 seconds',
      buttons: [cancel, { label: 'Confirm', variant: 'primary' }],
    },
  },
  {
    id: 'dialog',
    label: '<Dialog>',
    change: 'Rendered in place, reads your state',
    Demo: EditNote,
    picture: {
      kind: 'custom',
      title: 'Edit note',
      message: '12 characters',
      content: <textarea defaultValue="Call the bank" />,
      buttons: [{ label: 'Done' }],
    },
  },
  {
    id: 'confirmdialog',
    label: '<ConfirmDialog>',
    change: 'confirm, rendered in place',
    Demo: LeavePage,
    picture: {
      kind: 'confirm',
      title: 'Leave without saving?',
      buttons: [cancel, { label: 'Leave', variant: 'primary' }],
    },
  },
  {
    id: 'dialoglayout',
    label: 'DialogLayout',
    change: 'Title, content and buttons',
    Demo: () => <Try run={renameWorkspace}>Rename workspace</Try>,
    picture: {
      kind: 'custom',
      title: 'Rename workspace',
      message: 'Everyone in it sees the new name.',
      content: <input defaultValue="Acme" />,
      buttons: [cancel, { label: 'Save', variant: 'primary' }],
    },
  },
  {
    id: 'dialoghost-and-usedialog',
    label: 'DialogHost',
    change: 'Dialogs read your providers',
    Demo: ShowTheme,
    picture: {
      kind: 'alert',
      content: <ThemeName />,
      buttons: [{ label: 'OK', variant: 'primary' }],
    },
  },
  {
    id: 'configuredialogs',
    label: 'configureDialogs',
    change: 'Defaults for every dialog',
    Demo: () => <Try run={askInThaiOnce}>ลบไฟล์</Try>,
    picture: {
      kind: 'confirm',
      tone: 'danger',
      title: 'ลบไฟล์นี้ไหม',
      buttons: [{ label: 'ยกเลิก' }, { label: 'ลบ', variant: 'danger' }],
    },
  },
  {
    id: 'confirmalert',
    label: 'confirmAlert',
    change: 'The 3.0 API and look',
    Demo: SubmitOrder,
    picture: {
      kind: 'custom',
      legacy: true,
      title: 'Confirm to submit',
      message: 'Are you sure to do this?',
      buttons: [{ label: 'Yes' }, { label: 'No' }],
    },
  },
  {
    id: 'customui',
    label: 'customUI',
    change: 'Your own 3.0 dialog',
    Demo: ShowTerms,
    picture: {
      kind: 'custom',
      title: 'Terms updated',
      message: 'Read what changed before you go on.',
      buttons: [{ label: 'Got it', variant: 'primary' }],
    },
  },
]

export function ApiGallery() {
  return <Gallery items={apiExamples} />
}

// Getting started shows the three calls most apps start with, linked to their API sections.
export function StartGallery() {
  return <Gallery items={apiExamples.slice(0, 3).map((e) => ({ ...e, href: `/docs/api#${e.id}` }))} />
}
