'use client'
import { useState } from 'react'
import { Dialog, DialogLayout } from 'react-confirm-alert'

export function RenameDialog() {
  const [name, setName] = useState('Q3 report.pdf')
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(name)
  const [error, setError] = useState('')
  const start = () => {
    setValue(name)
    setError('')
    setOpen(true)
  }
  return (
    <div className="row">
      <span>{name}</span>
      <button onClick={start}>Rename</button>
      <Dialog open={open} onOpenChange={setOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!value.trim()) return setError('Give it a name')
            setName(value.trim())
            setOpen(false)
          }}
        >
          <DialogLayout
            title="Rename file"
            actions={[
              { label: 'Cancel', onClick: () => setOpen(false) },
              { label: 'Rename', variant: 'primary', type: 'submit' },
            ]}
          >
            <label htmlFor="rename-name">Name</label>
            <input
              id="rename-name"
              data-autofocus
              value={value}
              aria-invalid={!!error}
              onChange={(e) => {
                setValue(e.target.value)
                setError('')
              }}
            />
            {error && <p data-slot="error">{error}</p>}
          </DialogLayout>
        </form>
      </Dialog>
    </div>
  )
}
