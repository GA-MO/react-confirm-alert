'use client'
import { useState } from 'react'
import { prompt } from 'react-confirm-alert'

export function RenameConfirm() {
  const [name, setName] = useState('Q3 report.pdf')
  async function rename() {
    const next = await prompt({
      title: 'Rename file',
      label: 'Name',
      defaultValue: name,
      content: <p>Keep the extension, so the file still opens.</p>,
      validate: (value) => (value.trim() ? null : 'Give it a name'),
      submitLabel: 'Rename',
    })
    if (next) setName(next.trim())
  }
  return (
    <div className="row">
      <span>{name}</span>
      <button onClick={rename}>Rename</button>
    </div>
  )
}
