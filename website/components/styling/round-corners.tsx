'use client'
import { alert } from 'react-confirm-alert'
import './round-corners.css'

export function RoundCorners() {
  return (
    <button
      onClick={() =>
        alert({
          title: 'Saved',
          message: 'Your changes are live.',
          classNames: { dialog: 'dialog-round' },
        })
      }
    >
      Save
    </button>
  )
}
