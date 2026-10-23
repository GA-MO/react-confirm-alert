'use client'
import { useState } from 'react'
import { confirm } from 'react-confirm-alert'

const save = () => new Promise((done) => setTimeout(done, 1500))

export function PublishButton() {
  const [result, setResult] = useState('')

  async function onClick() {
    const ok = await confirm({
      title: 'Publish changes?',
      confirmLabel: 'Publish',
      // The button shows a busy state until this settles.
      onConfirm: async () => { await save() }, // [!code highlight]
    })
    setResult(`confirm() → ${ok}`)
  }

  return (
    <>
      <button onClick={onClick}>Publish</button>
      <output>{result}</output>
    </>
  )
}
