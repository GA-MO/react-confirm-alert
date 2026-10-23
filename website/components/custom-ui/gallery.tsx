'use client'
import { Gallery, type GalleryItem } from '../gallery'
import { AssignOpenDialog } from './assign-open-dialog'
import { DeleteOpenDialog } from './delete-open-dialog'
import { InviteCustomUI } from './invite-custom-ui'
import { RenameOpenDialog } from './rename-open-dialog'

const cancel = { label: 'Cancel' }

// Same order and anchors as the headings in content/docs/custom-ui.mdx.
// Each picture repeats its example's content, so the card shows the dialog the button opens.
export const customUIExamples: GalleryItem[] = [
  {
    id: 'a-form-with-validation',
    label: 'A form with validation',
    change: 'openDialog + DialogLayout',
    Demo: RenameOpenDialog,
    picture: {
      kind: 'custom',
      title: 'Rename file',
      content: (
        <>
          <label>Name</label>
          <input defaultValue="Q3 report.pdf" />
        </>
      ),
      buttons: [cancel, { label: 'Rename', variant: 'primary' }],
    },
  },
  {
    id: 'pick-from-a-list',
    label: 'Pick from a list',
    change: 'Radios, no class names',
    Demo: AssignOpenDialog,
    picture: {
      kind: 'custom',
      title: 'Assign to',
      message: 'They get an email with a link to the task.',
      content: ['Ana Silva', 'Ben Ito', 'Chai Wong'].map((name, i) => (
        <label key={name}><input type="radio" name="thumb-member" defaultChecked={i === 0} /> {name}</label>
      )),
      buttons: [cancel, { label: 'Assign', variant: 'primary' }],
    },
  },
  {
    id: 'type-the-name-to-delete',
    label: 'Type the name to delete',
    change: 'A button that waits',
    Demo: DeleteOpenDialog,
    picture: {
      kind: 'custom',
      tone: 'danger',
      title: 'Delete acme-web?',
      message: 'This deletes the project and its deploys.',
      content: (
        <>
          <label>Type acme-web to confirm</label>
          <input defaultValue="acme-web" />
        </>
      ),
      buttons: [cancel, { label: 'Delete', variant: 'danger' }],
    },
  },
  {
    id: 'customui-from-30',
    label: 'customUI from 3.0',
    change: 'confirmAlert + skin: true',
    Demo: InviteCustomUI,
    picture: {
      kind: 'custom',
      title: 'Invite a teammate',
      message: 'They can open every board in this workspace.',
      content: (
        <>
          <label>Email</label>
          <input defaultValue="ana@acme.co" />
          <label>Role</label>
          <select><option>Viewer</option></select>
        </>
      ),
      buttons: [cancel, { label: 'Send invite', variant: 'primary' }],
    },
  },
]

export function CustomUIGallery() {
  return <Gallery items={customUIExamples} />
}
