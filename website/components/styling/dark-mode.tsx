'use client'
import { useState } from 'react'
import { Dialog, DialogLayout } from 'react-confirm-alert'

// In your app the attribute (or class="dark") goes on <html>.
export function DarkMode() {
  const [open, setOpen] = useState(false)
  return (
    <div data-theme="dark">
      <button onClick={() => setOpen(true)}>Sign out</button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogLayout
          title="Sign out?"
          message="You can sign back in at any time."
          actions={[
            { label: 'Cancel', onClick: () => setOpen(false) },
            {
              label: 'Sign out',
              variant: 'primary',
              onClick: () => setOpen(false),
            },
          ]}
        />
      </Dialog>
    </div>
  )
}
