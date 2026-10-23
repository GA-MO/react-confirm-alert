'use client'
import { useState } from 'react'
import { confirm } from 'react-confirm-alert'

export function InviteConfirm() {
  const [sent, setSent] = useState('No invites yet')
  async function invite() {
    const form = { email: '', role: 'Viewer' }
    const ok = await confirm({
      title: 'Invite a teammate',
      message: 'They can open every board in this workspace.',
      content: (
        <>
          <label htmlFor="invite-email">Email</label>
          <input id="invite-email" type="email" data-autofocus onChange={(e) => { form.email = e.target.value }} />
          <label htmlFor="invite-role">Role</label>
          <select id="invite-role" defaultValue="Viewer" onChange={(e) => { form.role = e.target.value }}>
            <option>Viewer</option>
            <option>Editor</option>
            <option>Admin</option>
          </select>
        </>
      ),
      confirmLabel: 'Send invite',
    })
    if (ok && form.email) setSent(`${form.email} as ${form.role}`)
  }
  return (
    <div className="row">
      <span>{sent}</span>
      <button onClick={invite}>Invite</button>
    </div>
  )
}
