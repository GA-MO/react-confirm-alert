'use client'
import { confirm } from 'react-confirm-alert'

export function RoundButtons() {
  return (
    <button
      onClick={() =>
        confirm({
          title: 'Publish this post?',
          confirmLabel: 'Publish',
          classNames: { button: 'rounded-full px-4' },
        })
      }
    >
      Publish
    </button>
  )
}
