import type { ComponentType } from 'react'
import { AssignConfirm } from './assign-confirm'
import { AssignCustomUI } from './assign-custom-ui'
import { AssignDialog } from './assign-dialog'
import { AssignOpenDialog } from './assign-open-dialog'
import { DeleteConfirm } from './delete-confirm'
import { DeleteCustomUI } from './delete-custom-ui'
import { DeleteDialog } from './delete-dialog'
import { DeleteOpenDialog } from './delete-open-dialog'
import { InviteConfirm } from './invite-confirm'
import { InviteCustomUI } from './invite-custom-ui'
import { InviteDialog } from './invite-dialog'
import { InviteOpenDialog } from './invite-open-dialog'
import { RenameConfirm } from './rename-confirm'
import { RenameCustomUI } from './rename-custom-ui'
import { RenameDialog } from './rename-dialog'
import { RenameOpenDialog } from './rename-open-dialog'

export const apis = [
  { id: 'open-dialog', label: 'openDialog' },
  { id: 'dialog', label: '<Dialog>' },
  { id: 'confirm', label: 'confirm' },
  { id: 'custom-ui', label: 'customUI' }
] as const
export type Api = (typeof apis)[number]['id']

// Each variant is a real file in this folder; the playground shows that file's source next to it.
// card is the example's id in gallery.tsx, whose picture the playground shows.
export const examples: { id: string, card: string, label: string, first: Api, variants: Record<Api, ComponentType> }[] = [
  { id: 'rename', card: 'a-form-with-validation', label: 'Rename with validate', first: 'open-dialog', variants: { 'open-dialog': RenameOpenDialog, dialog: RenameDialog, confirm: RenameConfirm, 'custom-ui': RenameCustomUI } },
  { id: 'assign', card: 'pick-from-a-list', label: 'Pick a member', first: 'open-dialog', variants: { 'open-dialog': AssignOpenDialog, dialog: AssignDialog, confirm: AssignConfirm, 'custom-ui': AssignCustomUI } },
  { id: 'delete', card: 'type-the-name-to-delete', label: 'Type to delete', first: 'open-dialog', variants: { 'open-dialog': DeleteOpenDialog, dialog: DeleteDialog, confirm: DeleteConfirm, 'custom-ui': DeleteCustomUI } },
  { id: 'invite', card: 'customui-from-30', label: 'customUI with skin', first: 'custom-ui', variants: { 'open-dialog': InviteOpenDialog, dialog: InviteDialog, confirm: InviteConfirm, 'custom-ui': InviteCustomUI } }
]
