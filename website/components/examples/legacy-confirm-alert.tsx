'use client'
import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'

export function LegacyConfirm() {
  const [result, setResult] = useState('')

  function onClick() {
    confirmAlert({ // [!code highlight:7]
      title: 'Confirm to submit',
      message: 'Are you sure to do this?',
      buttons: [
        { label: 'Yes', onClick: () => setResult('clicked Yes') },
        { label: 'No', onClick: () => setResult('clicked No') },
      ],
    })
  }

  return (
    <>
      <div className="row">
        <span>Order #1042</span>
        <button onClick={onClick}>Submit</button>
      </div>
      <output>{result}</output>
    </>
  )
}
