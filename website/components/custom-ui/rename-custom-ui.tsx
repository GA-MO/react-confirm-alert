'use client'
import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'

function RenameForm({
  name,
  done,
}: {
  name: string
  done: (name?: string) => void
}) {
  const [value, setValue] = useState(name)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (value.trim()) done(value.trim())
      }}
    >
      <h1>Rename file</h1>
      <label htmlFor="rename-name">Name</label>
      <input
        id="rename-name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="react-confirm-alert-button-group">
        <button type="button" onClick={() => done()}>
          Cancel
        </button>
        <button data-variant="primary" disabled={!value.trim()}>
          Rename
        </button>
      </div>
    </form>
  )
}

export function RenameCustomUI() {
  const [name, setName] = useState('Q3 report.pdf')
  const rename = () =>
    confirmAlert({
      skin: true, // the new look; without it customUI looks as in 3.0
      customUI: ({ onClose }) => (
        <RenameForm
          name={name}
          done={(next) => {
            if (next) setName(next)
            onClose()
          }}
        />
      ),
    })
  return (
    <div className="row">
      <span>{name}</span>
      <button onClick={rename}>Rename</button>
    </div>
  )
}
