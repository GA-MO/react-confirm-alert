'use client'
import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'

const project = 'acme-web'
const deleteProject = () => new Promise((r) => setTimeout(r, 1200))

function DeleteForm({ done }: { done: (deleted: boolean) => void }) {
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <>
      <h1>Delete {project}?</h1>
      <p>This deletes the project and its deploys. It cannot be undone.</p>
      <label htmlFor="delete-name">Type {project} to confirm</label>
      <input id="delete-name" autoComplete="off" value={typed} onChange={(e) => setTyped(e.target.value)} />
      <div className="react-confirm-alert-button-group">
        <button onClick={() => done(false)} disabled={busy}>Cancel</button>
        <button
          data-variant="danger"
          aria-busy={busy}
          disabled={typed !== project || busy}
          onClick={async () => { setBusy(true); await deleteProject(); done(true) }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

export function DeleteCustomUI() {
  const [status, setStatus] = useState('Active')
  const remove = () =>
    confirmAlert({
      skin: true,
      customUI: ({ onClose }) => <DeleteForm done={(deleted) => { if (deleted) setStatus('Deleted'); onClose() }} />,
    })
  return (
    <div className="row">
      <span>{project}: {status}</span>
      <button onClick={remove}>Delete</button>
    </div>
  )
}
