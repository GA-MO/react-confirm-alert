'use client'
import { usePathname } from 'next/navigation'
import { DialogHost } from 'react-confirm-alert'

export function Dialogs() {
  return <DialogHost dismissKey={usePathname()} />
}
