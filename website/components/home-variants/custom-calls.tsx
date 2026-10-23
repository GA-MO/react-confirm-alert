'use client'
import { useState } from 'react'
import { DialogLayout, openDialog } from 'react-confirm-alert'

function RenameForm({ close }: { close: (name: string | null) => void }) {
  const [error, setError] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const name = String(new FormData(e.currentTarget).get('name')).trim()
        if (name) close(name)
        else setError('Give it a name')
      }}
    >
      <DialogLayout
        title="Rename file"
        actions={[
          { label: 'Cancel', onClick: () => close(null) },
          { label: 'Rename', variant: 'primary', type: 'submit' },
        ]}
      >
        <label htmlFor="home-rename">Name</label>
        <input id="home-rename" name="name" data-autofocus defaultValue="Q3 report.pdf" aria-invalid={!!error} onChange={() => setError('')} />
        {error && <p data-slot="error">{error}</p>}
      </DialogLayout>
    </form>
  )
}

export const renameFile = () =>
  openDialog<string | null>({ render: ({ close }) => <RenameForm close={close} /> }).result

const members = ['Ana Silva', 'Ben Ito', 'Chai Wong']

export const pickMember = () =>
  openDialog<string>({
    render: ({ close, dismiss }) => (
      <form onSubmit={(e) => { e.preventDefault(); close(String(new FormData(e.currentTarget).get('member'))) }}>
        <DialogLayout
          title="Assign to"
          message="They get an email with a link to the task."
          actions={[{ label: 'Cancel', onClick: dismiss }, { label: 'Assign', variant: 'primary', type: 'submit' }]}
        >
          {members.map((name, i) => (
            <label key={name}><input type="radio" name="member" value={name} defaultChecked={i === 0} /> {name}</label>
          ))}
        </DialogLayout>
      </form>
    ),
  }).result

const project = 'acme-web'
const wait = () => new Promise((done) => setTimeout(done, 1200))

function DeleteForm({ close, dismiss }: { close: (deleted: boolean) => void, dismiss: () => void }) {
  const [typed, setTyped] = useState('')
  return (
    <DialogLayout
      title={`Delete ${project}?`}
      message="This deletes the project and its deploys."
      actions={[
        { label: 'Cancel', onClick: dismiss },
        { label: 'Delete', variant: 'danger', disabled: typed !== project, onClick: () => wait().then(() => close(true)) },
      ]}
    >
      <label htmlFor="home-delete">Type {project} to confirm</label>
      <input id="home-delete" data-autofocus autoComplete="off" value={typed} onChange={(e) => setTyped(e.target.value)} />
    </DialogLayout>
  )
}

export const deleteProject = () =>
  openDialog<boolean>({ render: ({ close, dismiss }) => <DeleteForm close={close} dismiss={dismiss} /> }).result
