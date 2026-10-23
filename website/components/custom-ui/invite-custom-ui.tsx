'use client'
import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'

type Invite = { email: string; role: string }

function InviteForm({ done }: { done: (invite?: Invite) => void }) {
  const [invite, set] = useState<Invite>({
    email: '',
    role: 'Viewer',
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        done(invite)
      }}
    >
      <h1>Invite a teammate</h1>
      <p>They can open every board in this workspace.</p>
      <label htmlFor="invite-email">Email</label>
      <input
        id="invite-email"
        type="email"
        required
        data-autofocus
        value={invite.email}
        onChange={(e) => set({ ...invite, email: e.target.value })}
      />
      <label htmlFor="invite-role">Role</label>
      <select
        id="invite-role"
        value={invite.role}
        onChange={(e) => set({ ...invite, role: e.target.value })}
      >
        <option>Viewer</option>
        <option>Editor</option>
        <option>Admin</option>
      </select>
      <div className="react-confirm-alert-button-group">
        <button type="button" onClick={() => done()}>
          Cancel
        </button>
        <button data-variant="primary">Send invite</button>
      </div>
    </form>
  )
}

export function InviteCustomUI() {
  const [sent, setSent] = useState('No invites yet')
  const invite = () =>
    confirmAlert({
      skin: true,
      customUI: ({ onClose }) => (
        <InviteForm
          done={(i) => {
            if (i) setSent(`${i.email} as ${i.role}`)
            onClose()
          }}
        />
      ),
    })
  return (
    <div className="row">
      <span>{sent}</span>
      <button onClick={invite}>Invite</button>
    </div>
  )
}
