'use client'
import { useState } from 'react'
import { alert } from 'react-confirm-alert'

export function SavedAlert() {
  const [result, setResult] = useState('')

  async function onClick() {
    await alert({ // [!code highlight:4]
      title: 'Saved',
      message: 'Your changes are safe.',
    })
    setResult('alert() resolved')
  }

  return (
    <>
      <div className="row">
        <span>Profile changes</span>
        <button onClick={onClick}>Save</button>
      </div>
      <output>{result}</output>
    </>
  )
}
