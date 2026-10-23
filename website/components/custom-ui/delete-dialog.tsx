'use client'
import { useState } from 'react'
import { Dialog, DialogLayout } from 'react-confirm-alert'

const project = 'acme-web'
const deleteProject = () => new Promise((r) => setTimeout(r, 1200))

export function DeleteDialog() {
  const [status, setStatus] = useState('Active')
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const start = () => {
    setTyped('')
    setOpen(true)
  }
  return (
    <div className="row">
      <span>
        {project}: {status}
      </span>
      <button onClick={start}>Delete</button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogLayout
          title={`Delete ${project}?`}
          message="This deletes the project and its deploys."
          actions={[
            { label: 'Cancel', onClick: () => setOpen(false) },
            {
              label: 'Delete',
              variant: 'danger',
              disabled: typed !== project,
              onClick: async () => {
                await deleteProject()
                setStatus('Deleted')
                setOpen(false)
              },
            },
          ]}
        >
          <label htmlFor="delete-name">
            Type {project} to confirm
          </label>
          <input
            id="delete-name"
            data-autofocus
            autoComplete="off"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
        </DialogLayout>
      </Dialog>
    </div>
  )
}
