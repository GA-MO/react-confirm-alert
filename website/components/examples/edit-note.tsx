'use client'
import { useId, useState } from 'react'
import { Dialog } from 'react-confirm-alert'

export function EditNote() {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const id = useId()

  return (
    <>
      <div className="row">
        <span>{note || 'No note yet'}</span>
        <button onClick={() => setOpen(true)}>Edit note</button>
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        aria-labelledby={`${id}-title`}
      >
        <div className="react-confirm-alert-body">
          <h1 id={`${id}-title`} data-slot="title">Edit note</h1>
          <div data-slot="field">
            <label htmlFor={id} data-slot="label">Note</label>
            <textarea // [!code highlight:6]
              id={id}
              data-slot="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="react-confirm-alert-button-group" data-slot="actions">
            <button data-variant="primary" onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
