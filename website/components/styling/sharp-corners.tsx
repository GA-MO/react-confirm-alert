'use client'
import { confirm } from 'react-confirm-alert'
import './sharp-corners.css'

export function SharpCorners() {
  return (
    <button
      onClick={() =>
        confirm({
          title: 'Archive 12 files?',
          message: 'You can restore them from the archive.',
          confirmLabel: 'Archive',
          classNames: { dialog: 'dialog-sharp' },
        })
      }
    >
      Archive
    </button>
  )
}
