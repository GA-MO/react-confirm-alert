'use client'
import { useState } from 'react'
import { Dialog } from 'react-confirm-alert'

export function EditNote() {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')

  return (
    <>
      <div className="row">
        <span>{note || 'No note yet'}</span>
        <button onClick={() => setOpen(true)}>Edit note</button>
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        aria-label="Edit note"
      >
        <div className="react-confirm-alert-body">
          <h1>Edit note</h1>
          <textarea // [!code highlight:4]
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="react-confirm-alert-button-group">
            <button onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
