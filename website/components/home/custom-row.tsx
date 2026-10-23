'use client'
import { customUIExamples } from '../custom-ui/gallery'
import { cardFrom, Gallery, type GalleryItem } from '../gallery'
import { Try } from '../try'
import { deleteProject, pickMember, renameFile } from './custom-calls'

// The Custom UI page's pictures, with triggers that show what each dialog's Promise resolves to.
export const customRow: GalleryItem[] = [
  {
    ...cardFrom(customUIExamples, 'a-form-with-validation', { href: '/docs/custom-ui#a-form-with-validation', label: 'A form', change: 'Validates before it closes' }),
    Demo: () => <Try run={renameFile}>Rename</Try>,
  },
  {
    ...cardFrom(customUIExamples, 'pick-from-a-list', { href: '/docs/custom-ui#pick-from-a-list', label: 'Pick a member', change: 'Plain radios, no class names' }),
    Demo: () => <Try run={pickMember}>Assign</Try>,
  },
  {
    ...cardFrom(customUIExamples, 'type-the-name-to-delete', { href: '/docs/custom-ui#type-the-name-to-delete', label: 'Type to delete', change: 'The button waits for the delete' }),
    Demo: () => <Try run={deleteProject}>Delete</Try>,
  },
]

export function CustomRow() {
  return <Gallery items={customRow} />
}
