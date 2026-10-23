'use client'
import { useState } from 'react'
import { DialogLayout, openDialog } from 'react-confirm-alert'

const project = 'acme-web'
const deleteProject = () => new Promise((r) => setTimeout(r, 1200))

function DeleteForm({
  close,
  dismiss,
}: {
  close: (deleted: boolean) => void
  dismiss: () => void
}) {
  const [typed, setTyped] = useState('')
  return (
    <DialogLayout
      title={`Delete ${project}?`}
      message="This deletes the project and its deploys."
      actions={[
        { label: 'Cancel', onClick: dismiss },
        // A Promise keeps the button busy and the dialog open.
        {
          label: 'Delete',
          variant: 'danger',
          disabled: typed !== project,
          onClick: () => deleteProject().then(() => close(true)),
        },
      ]}
    >
      <label htmlFor="delete-name">Type {project} to confirm</label>
      <input
        id="delete-name"
        data-autofocus
        autoComplete="off"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
      />
    </DialogLayout>
  )
}

export function DeleteOpenDialog() {
  const [status, setStatus] = useState('Active')
  async function remove() {
    const deleted = await openDialog<boolean>({
      render: ({ close, dismiss }) => (
        <DeleteForm close={close} dismiss={dismiss} />
      ),
    }).result
    if (deleted) setStatus('Deleted')
  }
  return (
    <div className="row">
      <span>
        {project}: {status}
      </span>
      <button onClick={remove}>Delete</button>
    </div>
  )
}
