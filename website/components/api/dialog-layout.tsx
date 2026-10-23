'use client'
import { DialogLayout, openDialog } from 'react-confirm-alert'

const save = () => new Promise((done) => setTimeout(done, 1500))

export const renameWorkspace = () =>
  openDialog({
    render: ({ close, dismiss }) => (
      <DialogLayout
        title="Rename workspace"
        message="Everyone in it sees the new name."
        actions={[
          { label: 'Cancel', onClick: dismiss },
          {
            label: 'Save',
            variant: 'primary',
            onClick: () => save().then(() => close()),
          },
        ]}
      >
        <input aria-label="Name" defaultValue="Acme" />
      </DialogLayout>
    ),
  }).result
