'use client'
import { prompt } from 'react-confirm-alert'
import './compact.css'

export function Compact() {
  return (
    <button
      onClick={() =>
        prompt({
          title: 'New folder',
          label: 'Name',
          defaultValue: 'Untitled',
          classNames: { dialog: 'dialog-compact' },
        })
      }
    >
      New folder
    </button>
  )
}
