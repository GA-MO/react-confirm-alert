'use client'
import { useState } from 'react'
import { DialogLayout, openDialog } from 'react-confirm-alert'

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

function Picker({
  close,
  dismiss,
}: {
  close: (name: string) => void
  dismiss: () => void
}) {
  const [picked, setPicked] = useState(members[0]!)
  return (
    <DialogLayout
      title="Assign to"
      message="They get an email with a link to the task."
      actions={[
        { label: 'Cancel', onClick: dismiss },
        {
          label: 'Assign',
          variant: 'primary',
          onClick: () => close(picked),
        },
      ]}
    >
      <Members value={picked} onChange={setPicked} />
    </DialogLayout>
  )
}

export function AssignOpenDialog() {
  const [owner, setOwner] = useState('Nobody yet')
  async function assign() {
    const picked = await openDialog<string>({
      render: ({ close, dismiss }) => (
        <Picker close={close} dismiss={dismiss} />
      ),
    }).result
    if (picked) setOwner(picked)
  }
  return (
    <div className="row">
      <span>{owner}</span>
      <button onClick={assign}>Assign</button>
    </div>
  )
}
