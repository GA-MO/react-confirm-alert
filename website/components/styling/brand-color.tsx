'use client'
import { confirm } from 'react-confirm-alert'
import './brand-color.css'

export function BrandColor() {
  return (
    <button
      onClick={() =>
        confirm({
          title: 'Publish this post?',
          message: 'It goes live for everyone right away.',
          confirmLabel: 'Publish',
          classNames: { dialog: 'dialog-brand' },
        })
      }
    >
      Publish
    </button>
  )
}
