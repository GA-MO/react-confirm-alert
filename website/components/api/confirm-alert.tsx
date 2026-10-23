'use client'
import { confirmAlert } from 'react-confirm-alert'

export function SubmitOrder() {
  return (
    <button
      onClick={() =>
        confirmAlert({
          title: 'Confirm to submit',
          message: 'Are you sure to do this?',
          buttons: [{ label: 'Yes' }, { label: 'No' }],
        })
      }
    >
      Submit
    </button>
  )
}
