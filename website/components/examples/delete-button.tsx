'use client'
import { useState } from 'react'
import { confirm } from 'react-confirm-alert'

export function DeleteButton() {
  const [result, setResult] = useState('')

  async function onClick() {
    const ok = await confirm({ // [!code highlight:6]
      title: 'Delete “Q3 report.pdf”?',
      message: 'It moves to the trash for 30 days.',
      tone: 'danger',
      confirmLabel: 'Delete',
    })
    setResult(`confirm() → ${ok}`)
  }

  return (
    <>
      <button onClick={onClick}>Delete file</button>
      <output>{result}</output>
    </>
  )
}
