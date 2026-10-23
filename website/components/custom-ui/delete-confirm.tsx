'use client'
import { useState } from 'react'
import { prompt } from 'react-confirm-alert'

const project = 'acme-web'
const deleteProject = () => new Promise((r) => setTimeout(r, 1200))

export function DeleteConfirm() {
  const [status, setStatus] = useState('Active')
  async function remove() {
    const typed = await prompt({
      title: `Delete ${project}?`,
      message: 'This deletes the project and its deploys. It cannot be undone.',
      label: `Type ${project} to confirm`,
      inputProps: { autoComplete: 'off' },
      // validate can wait: the dialog stays open and busy until it resolves.
      validate: async (value) => {
        if (value !== project) return `Type ${project} exactly`
        await deleteProject()
        return null
      },
      submitLabel: 'Delete',
    })
    if (typed) setStatus('Deleted')
  }
  return (
    <div className="row">
      <span>{project}: {status}</span>
      <button onClick={remove}>Delete</button>
    </div>
  )
}
