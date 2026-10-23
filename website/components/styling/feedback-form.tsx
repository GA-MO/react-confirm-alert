'use client'
import { DialogLayout, openDialog } from 'react-confirm-alert'

export function FeedbackForm() {
  return (
    <button
      onClick={() =>
        openDialog({
          render: ({ close, dismiss }) => (
            <form onSubmit={(e) => { e.preventDefault(); close() }}>
              <DialogLayout
                title="Send feedback"
                actions={[
                  { label: 'Cancel', onClick: dismiss },
                  { label: 'Send', variant: 'primary', type: 'submit' },
                ]}
              >
                <label htmlFor="topic">Topic</label>
                <select id="topic">
                  <option>Bug</option>
                  <option>Idea</option>
                  <option>Question</option>
                </select>
                <label htmlFor="details">Details</label>
                <textarea id="details" data-autofocus required />
                <label>
                  <input type="checkbox" defaultChecked /> You can email me about this
                </label>
              </DialogLayout>
            </form>
          ),
        })
      }
    >
      Send feedback
    </button>
  )
}
