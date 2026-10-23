'use client'
import { useState } from 'react'
import { Dialog, DialogLayout } from 'react-confirm-alert'

export function EditNote() {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  return (
    <>
      <button onClick={() => setOpen(true)}>Edit note</button>
      <output>{note}</output>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogLayout
          title="Edit note"
          message={`${note.length} characters`}
          actions={[{ label: 'Done', onClick: () => setOpen(false) }]}
        >
          <textarea
            aria-label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogLayout>
      </Dialog>
    </>
  )
}
