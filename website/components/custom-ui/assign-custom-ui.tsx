'use client'
import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'

const members = ['Ana Silva', 'Ben Ito', 'Chai Wong']

export function AssignCustomUI() {
  const [owner, setOwner] = useState('Nobody yet')
  const assign = () =>
    confirmAlert({
      skin: true,
      customUI: ({ onClose }) => (
        <>
          <h1>Assign to</h1>
          <p>They get an email with a link to the task.</p>
          <div className="react-confirm-alert-button-group">
            {members.map((m) => <button key={m} onClick={() => { setOwner(m); onClose() }}>{m}</button>)}
          </div>
        </>
      ),
    })
  return (
    <div className="row">
      <span>{owner}</span>
      <button onClick={assign}>Assign</button>
    </div>
  )
}
