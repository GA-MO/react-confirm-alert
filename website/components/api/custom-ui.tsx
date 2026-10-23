'use client'
import { confirmAlert } from 'react-confirm-alert'

export function ShowTerms() {
  return (
    <button
      onClick={() =>
        confirmAlert({
          skin: true,
          customUI: ({ onClose }) => (
            <>
              <h1>Terms updated</h1>
              <p>Read what changed before you go on.</p>
              <button data-variant="primary" onClick={onClose}>
                Got it
              </button>
            </>
          ),
        })
      }
    >
      Show terms
    </button>
  )
}
