'use client'
import { useState } from 'react'
import { DialogLayout, openDialog } from 'react-confirm-alert'

function RenameForm({ name, close }: { name: string, close: (name: string | null) => void }) {
  const [value, setValue] = useState(name)
  const [error, setError] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (value.trim()) close(value.trim()); else setError('Give it a name') }}>
      <DialogLayout
        title="Rename file"
        actions={[{ label: 'Cancel', onClick: () => close(null) }, { label: 'Rename', variant: 'primary', type: 'submit' }]}
      >
        <label htmlFor="rename-name">Name</label>
        <input id="rename-name" data-autofocus value={value} aria-invalid={!!error} onChange={(e) => { setValue(e.target.value); setError('') }} />
        {error && <p data-slot="error">{error}</p>}
      </DialogLayout>
    </form>
  )
}

export function RenameOpenDialog() {
  const [name, setName] = useState('Q3 report.pdf')
  async function rename() {
    // Resolves with what close() got, or undefined on Escape and outside clicks.
    const next = await openDialog<string | null>({ render: ({ close }) => <RenameForm name={name} close={close} /> }).result
    if (next) setName(next)
  }
  return (
    <div className="row">
      <span>{name}</span>
      <button onClick={rename}>Rename</button>
    </div>
  )
}
