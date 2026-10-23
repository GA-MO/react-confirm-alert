'use client'
import { useState } from 'react'
import { Dialog, DialogLayout } from 'react-confirm-alert'

type Invite = { email: string; role: string }

export function InviteDialog() {
  const [sent, setSent] = useState('No invites yet')
  const [open, setOpen] = useState(false)
  const [invite, set] = useState<Invite>({
    email: '',
    role: 'Viewer',
  })
  return (
    <div className="row">
      <span>{sent}</span>
      <button onClick={() => setOpen(true)}>Invite</button>
      <Dialog open={open} onOpenChange={setOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSent(`${invite.email} as ${invite.role}`)
            setOpen(false)
          }}
        >
          <DialogLayout
            title="Invite a teammate"
            message="They can open every board in this workspace."
            actions={[
              { label: 'Cancel', onClick: () => setOpen(false) },
              {
                label: 'Send invite',
                variant: 'primary',
                type: 'submit',
              },
            ]}
          >
            <label htmlFor="invite-email">Email</label>
            <input
              id="invite-email"
              type="email"
              required
              data-autofocus
              value={invite.email}
              onChange={(e) =>
                set({ ...invite, email: e.target.value })
              }
            />
            <label htmlFor="invite-role">Role</label>
            <select
              id="invite-role"
              value={invite.role}
              onChange={(e) =>
                set({ ...invite, role: e.target.value })
              }
            >
              <option>Viewer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
          </DialogLayout>
        </form>
      </Dialog>
    </div>
  )
}
