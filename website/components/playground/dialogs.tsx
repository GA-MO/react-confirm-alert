'use client'
import { useId, useState } from 'react'
import { confirm, Dialog } from 'react-confirm-alert'

export function Nested ({ dismiss, log }: { dismiss: () => void, log: (t: string) => void }) {
  return (
    <div className="react-confirm-alert-body">
      <h1 data-slot="title">Level 1</h1>
      <p data-slot="message">Open a second dialog on top. Escape closes the top one first.</p>
      <div className="react-confirm-alert-button-group" data-slot="actions">
        <button data-variant="primary" onClick={async () => log(`level 2 resolved ${await confirm('Level 2')}`)}>Open level 2</button>
        <button onClick={dismiss}>Close</button>
      </div>
    </div>
  )
}

export function Colors ({ close }: { close: (v: string) => void }) {
  const id = useId()
  return (
    <form
      className="react-confirm-alert-body"
      onSubmit={(e) => {
        e.preventDefault()
        close(new FormData(e.currentTarget).get('colour') as string)
      }}
    >
      <h1 data-slot="title">Pick a colour</h1>
      <div data-slot="field">
        <label htmlFor={id} data-slot="label">Colour</label>
        <select id={id} name="colour" data-slot="input" defaultValue="blue">
          {['red', 'green', 'blue'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="react-confirm-alert-button-group" data-slot="actions">
        <button data-variant="primary">Pick</button>
      </div>
    </form>
  )
}

export function NoteDialog ({ open, onOpenChange, onSave }: { open: boolean, onOpenChange: (open: boolean) => void, onSave: (note: string) => void }) {
  const id = useId()
  const [note, setNote] = useState('')
  return (
    <Dialog open={open} onOpenChange={onOpenChange} aria-labelledby={`${id}-title`}>
      <div className="react-confirm-alert-body">
        <h1 id={`${id}-title`} data-slot="title">Edit note</h1>
        <div data-slot="field">
          <label htmlFor={id} data-slot="label">Note</label>
          <textarea id={id} data-slot="input" value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Type, and the Save button follows the parent state" />
        </div>
        <div className="react-confirm-alert-button-group" data-slot="actions">
          <button onClick={() => onOpenChange(false)}>Cancel</button>
          <button data-variant="primary" disabled={!note.trim()} onClick={() => { onSave(note); onOpenChange(false) }}>Save</button>
        </div>
      </div>
    </Dialog>
  )
}
