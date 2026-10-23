'use client'
import { useState } from 'react'
import { ConfirmDialog } from 'react-confirm-alert'

export function LeavePage() {
  const [open, setOpen] = useState(false)
  const [left, setLeft] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Leave page</button>
      <output>{left && 'onConfirm ran'}</output>
      <ConfirmDialog
        kind="confirm"
        open={open}
        onOpenChange={setOpen}
        title="Leave without saving?"
        confirmLabel="Leave"
        onConfirm={() => setLeft(true)}
      />
    </>
  )
}
