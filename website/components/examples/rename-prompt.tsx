'use client'
import { useState } from 'react'
import { prompt } from 'react-confirm-alert'

export function RenamePrompt() {
  const [name, setName] = useState('Q3 report.pdf')
  const [result, setResult] = useState('')

  async function onClick() {
    const next = await prompt({ // [!code highlight:5]
      title: 'Rename file',
      defaultValue: name,
      validate: (value) => (value.trim() ? null : 'Give it a name'),
    })
    // next is null on Cancel or Escape
    setResult(`prompt() → ${JSON.stringify(next)}`)
    if (next) setName(next.trim())
  }

  return (
    <>
      <div className="row">
        <span>{name}</span>
        <button onClick={onClick}>Rename</button>
      </div>
      <output>{result}</output>
    </>
  )
}
