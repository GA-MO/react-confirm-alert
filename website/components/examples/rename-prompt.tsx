'use client'
import { useState } from 'react'
import { prompt } from 'react-confirm-alert'

export function RenamePrompt() {
  const [name, setName] = useState('Q3 report.pdf')

  async function onClick() {
    const next = await prompt({ // [!code highlight:5]
      title: 'Rename file',
      defaultValue: name,
      validate: (value) => (value.trim() ? null : 'Give it a name'),
    })
    if (next) setName(next.trim()) // next is null on Cancel or Escape
  }

  return (
    <>
      <button onClick={onClick}>Rename</button>
      <output>{name}</output>
    </>
  )
}
