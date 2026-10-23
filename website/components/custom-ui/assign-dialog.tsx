'use client'
import { useState } from 'react'
import { Dialog, DialogLayout } from 'react-confirm-alert'

const members = ['Ana Silva', 'Ben Ito', 'Chai Wong']

function Members({
  value,
  onChange,
}: {
  value: string
  onChange: (name: string) => void
}) {
  return members.map((m) => (
    <label key={m}>
      <input
        type="radio"
        name="member"
        value={m}
        checked={m === value}
        onChange={() => onChange(m)}
      />{' '}
      {m}
    </label>
  ))
}

export function AssignDialog() {
  const [owner, setOwner] = useState('Nobody yet')
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState(members[0]!)
  return (
    <div className="row">
      <span>{owner}</span>
      <button onClick={() => setOpen(true)}>Assign</button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogLayout
          title="Assign to"
          message="They get an email with a link to the task."
          actions={[
            { label: 'Cancel', onClick: () => setOpen(false) },
            {
              label: 'Assign',
              variant: 'primary',
              onClick: () => {
                setOwner(picked)
                setOpen(false)
              },
            },
          ]}
        >
          <Members value={picked} onChange={setPicked} />
        </DialogLayout>
      </Dialog>
    </div>
  )
}
