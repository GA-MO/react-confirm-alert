'use client'
import { useState } from 'react'
import { DialogLayout, openDialog } from 'react-confirm-alert'

type Invite = { email: string, role: string }

function InviteForm({ close, dismiss }: { close: (invite: Invite) => void, dismiss: () => void }) {
  const [invite, set] = useState<Invite>({ email: '', role: 'Viewer' })
  return (
    <form onSubmit={(e) => { e.preventDefault(); close(invite) }}>
      <DialogLayout
        title="Invite a teammate"
        message="They can open every board in this workspace."
        actions={[{ label: 'Cancel', onClick: dismiss }, { label: 'Send invite', variant: 'primary', type: 'submit' }]}
      >
        <label htmlFor="invite-email">Email</label>
        <input id="invite-email" type="email" required data-autofocus value={invite.email} onChange={(e) => set({ ...invite, email: e.target.value })} />
        <label htmlFor="invite-role">Role</label>
        <select id="invite-role" value={invite.role} onChange={(e) => set({ ...invite, role: e.target.value })}>
          <option>Viewer</option>
          <option>Editor</option>
          <option>Admin</option>
        </select>
      </DialogLayout>
    </form>
  )
}

export function InviteOpenDialog() {
  const [sent, setSent] = useState('No invites yet')
  async function invite() {
    const i = await openDialog<Invite>({ render: ({ close, dismiss }) => <InviteForm close={close} dismiss={dismiss} /> }).result
    if (i) setSent(`${i.email} as ${i.role}`)
  }
  return (
    <div className="row">
      <span>{sent}</span>
      <button onClick={invite}>Invite</button>
    </div>
  )
}
