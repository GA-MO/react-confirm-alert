'use client'
import { DialogLayout, openDialog } from 'react-confirm-alert'

export const pickTopic = () =>
  openDialog<string>({
    render: ({ close }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          close(new FormData(e.currentTarget).get('topic') as string)
        }}
      >
        <DialogLayout
          title="Send feedback"
          actions={[{ label: 'Send', variant: 'primary', type: 'submit' }]}
        >
          <label htmlFor="topic">Topic</label>
          <select id="topic" name="topic">
            <option>Bug</option>
            <option>Idea</option>
          </select>
        </DialogLayout>
      </form>
    ),
  }).result
