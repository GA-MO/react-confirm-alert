'use client'
import { alert } from 'react-confirm-alert'

export function QueueThree() {
  return (
    <button
      onClick={() => {
        for (const title of ['One', 'Two', 'Three']) {
          void alert({ title, strategy: 'queue' })
        }
      }}
    >
      Queue three
    </button>
  )
}
