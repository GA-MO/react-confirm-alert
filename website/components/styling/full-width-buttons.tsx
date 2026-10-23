'use client'
import { confirm } from 'react-confirm-alert'
import './full-width-buttons.css'

export function FullWidthButtons() {
  return (
    <button
      onClick={() =>
        confirm({
          title: 'Leave without saving?',
          message: 'Your edits on this page will be lost.',
          confirmLabel: 'Leave',
          cancelLabel: 'Stay',
          classNames: { button: 'button-fill' },
        })
      }
    >
      Leave page
    </button>
  )
}
