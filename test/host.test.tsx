import React, { createContext, useContext, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { buttonByText, cleanupPage, loadV3, overlay, setupPage } from './v3'

let lib: any
let roots: Root[] = []

beforeEach(async () => {
  setupPage()
  lib = await loadV3()
})
afterEach(() => {
  lib.closeAll()
  for (const root of roots) root.unmount()
  roots = []
  vi.restoreAllMocks()
  cleanupPage()
})

function render (element: React.ReactElement) {
  const host = document.createElement('div')
  document.getElementById('app')!.append(host)
  const root = createRoot(host)
  roots.push(root)
  root.render(element)
  return host
}

const Theme = createContext('missing')
const Reader = () => <span id="reader">{useContext(Theme)}</span>

test('confirm() renders inside DialogHost and reads its providers', async () => {
  const host = render(<Theme.Provider value="dark"><span id="mounted" /><lib.DialogHost /></Theme.Provider>)
  await vi.waitFor(() => expect(document.getElementById('mounted')).not.toBeNull())
  const result = lib.confirm({ title: 'Theme', message: <Reader /> })
  await vi.waitFor(() => expect(document.getElementById('reader')?.textContent).toBe('dark'))
  expect(host.contains(document.getElementById('reader'))).toBe(true)
  expect(document.getElementById('react-confirm-alert')).toBeNull()
  buttonByText('Confirm').click()
  await expect(result).resolves.toBe(true)
})

test('after the host unmounts, dialogs fall back to their own root', async () => {
  const root = createRoot(document.getElementById('app')!.appendChild(document.createElement('div')))
  root.render(<lib.DialogHost />)
  await new Promise((r) => setTimeout(r, 0))
  root.unmount()
  lib.confirmAlert({ title: 'Fallback' })
  await vi.waitFor(() => expect(overlay()!.parentElement!.id).toBe('react-confirm-alert'))
  buttonByText('Cancel').click()
})

test('ConfirmDialog runs onConfirm, then asks the parent to close', async () => {
  const onConfirm = vi.fn()
  function App () {
    const [open, setOpen] = useState(true)
    return <lib.ConfirmDialog kind="confirm" open={open} onOpenChange={setOpen} title="Publish?" onConfirm={onConfirm} />
  }
  render(<App />)
  await expect.element(page.getByRole('alertdialog', { name: 'Publish?' })).toBeInTheDocument()
  buttonByText('Confirm').click()
  await vi.waitFor(() => expect(document.querySelector('[data-rca]')).toBeNull())
  expect(onConfirm).toHaveBeenCalledTimes(1)
})

test('useDialog returns the module functions', () => {
  function Probe () {
    const dialogs = lib.useDialog()
    expect(dialogs.confirm).toBe(lib.confirm)
    return null
  }
  render(<Probe />)
})

test('under StrictMode a host keeps confirm() open, and an in-place Dialog stays open', async () => {
  const onOpenChange = vi.fn()
  const { StrictMode } = React
  render(
    <StrictMode>
      <span id="mounted" />
      <lib.DialogHost dismissKey="/a" />
      <lib.Dialog open onOpenChange={onOpenChange} aria-label="Inline"><p>inline</p></lib.Dialog>
    </StrictMode>
  )
  await vi.waitFor(() => expect(document.getElementById('mounted')).not.toBeNull())
  const result = vi.fn()
  lib.confirm({ title: 'Strict' }).then(result)
  await new Promise((r) => setTimeout(r, 100))
  expect(document.body.textContent).toContain('Strict')
  expect(onOpenChange).not.toHaveBeenCalled()
  expect(result).not.toHaveBeenCalled()
})

test('a dialog shown by a host moves to its own root when the host unmounts', async () => {
  const root = createRoot(document.getElementById('app')!.appendChild(document.createElement('div')))
  root.render(<><span id="mounted" /><lib.DialogHost /></>)
  await vi.waitFor(() => expect(document.getElementById('mounted')).not.toBeNull())
  const result = lib.confirm({ title: 'Moves' })
  await vi.waitFor(() => expect(document.body.textContent).toContain('Moves'))
  root.unmount()
  await vi.waitFor(() => expect(document.getElementById('react-confirm-alert')?.textContent).toContain('Moves'))
  buttonByText('Confirm').click()
  await expect(result).resolves.toBe(true)
})

test('under StrictMode, ConfirmDialog hands onConfirm a live signal and closes when it resolves', async () => {
  const { StrictMode } = React
  let aborted: boolean | undefined
  let finish!: () => void
  const onOpenChange = vi.fn()
  render(
    <StrictMode>
      <lib.ConfirmDialog
        kind="confirm"
        open
        onOpenChange={onOpenChange}
        title="Save?"
        onConfirm={({ signal }: { signal: AbortSignal }) => {
          aborted = signal.aborted
          return new Promise<void>((r) => { finish = r })
        }}
      />
    </StrictMode>
  )
  await vi.waitFor(() => buttonByText('Confirm'))
  buttonByText('Confirm').click()
  expect(aborted).toBe(false)
  finish()
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
})

test('an in-place Dialog with closeOnEscape false stays open through repeated Escape', async () => {
  const onOpenChange = vi.fn()
  render(
    <lib.Dialog open onOpenChange={onOpenChange} closeOnEscape={false} aria-label="Sticky">
      <button>inside</button>
    </lib.Dialog>
  )
  await vi.waitFor(() => buttonByText('inside'))
  for (let i = 0; i < 3; i++) await userEvent.keyboard('{Escape}')
  await new Promise((r) => setTimeout(r, 50))
  const frame = document.querySelector('[data-rca]') as HTMLElement
  if (frame instanceof HTMLDialogElement) expect(frame.open).toBe(true)
  expect(onOpenChange).not.toHaveBeenCalled()
})
