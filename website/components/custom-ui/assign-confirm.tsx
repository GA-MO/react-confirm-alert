'use client'
import { useState } from 'react'
import { confirm } from 'react-confirm-alert'

const members = ['Ana Silva', 'Ben Ito', 'Chai Wong']

export function AssignConfirm() {
  const [owner, setOwner] = useState('Nobody yet')
  async function assign() {
    let picked = members[0]!
    const ok = await confirm({
      title: 'Assign to',
      message: 'They get an email with a link to the task.',
      content: members.map((m) => (
        <label key={m}>
          <input
            type="radio"
            name="member"
            defaultChecked={m === picked}
            onChange={() => {
              picked = m
            }}
          />{' '}
          {m}
        </label>
      )),
      confirmLabel: 'Assign',
    })
    if (ok) setOwner(picked)
  }
  return (
    <div className="row">
      <span>{owner}</span>
      <button onClick={assign}>Assign</button>
    </div>
  )
}
