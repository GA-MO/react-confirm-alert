import React, { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { buttonByText, cleanupPage, loadV3, overlay, setupPage, spyConsole, waitForOverlay } from './v3'

let lib: any

beforeEach(async () => {
  setupPage()
  lib = await loadV3()
})
afterEach(() => {
  vi.restoreAllMocks()
  cleanupPage()
})

const nativeModal = typeof HTMLDialogElement.prototype.showModal === 'function'

test('confirmAlert is found by role dialog with its title as the name', async () => {
  lib.confirmAlert({ title: 'Named' })
  await waitForOverlay()
  await expect.element(page.getByRole('dialog', { name: 'Named' })).toBeInTheDocument()
  buttonByText('Cancel').click()
})

test('modal: true uses a native dialog when the browser has showModal, and a div otherwise', async () => {
  lib.confirmAlert({ title: 'Modal', modal: true })
  const el = await waitForOverlay()
  expect(el.tagName).toBe(nativeModal ? 'DIALOG' : 'DIV')
  if (nativeModal) expect((el as HTMLDialogElement).open).toBe(true)
  buttonByText('Cancel').click()
  expect(overlay()).toBeNull()
})

test('with modal: true, Tab never reaches the page behind', async () => {
  lib.confirmAlert({ title: 'Trap', modal: true })
  await waitForOverlay()
  const behind = document.getElementById('behind')!
  for (let i = 0; i < 6; i++) {
    await userEvent.tab()
    if (nativeModal) expect(document.activeElement).not.toBe(behind)
  }
  buttonByText('Cancel').click()
})

test('Escape on a native modal closes once, through the v3 keyboard rules', async () => {
  const afterClose = vi.fn()
  const onKeypressEscape = vi.fn()
  lib.confirmAlert({ title: 'Esc', modal: true, afterClose, onKeypressEscape })
  await waitForOverlay()
  await userEvent.keyboard('{Escape}')
  expect(overlay()).toBeNull()
  expect(onKeypressEscape).toHaveBeenCalledTimes(1)
  expect(afterClose).toHaveBeenCalledTimes(1)
})

test('StrictMode: the default export opens and closes 10 times without console errors', async () => {
  const consoleSpy = spyConsole()
  const host = document.createElement('div')
  document.getElementById('app')!.append(host)
  const Default = lib.default
  let toggle!: () => void
  function App() {
    const [open, setOpen] = useState(false)
    toggle = () => setOpen((o) => !o)
    return open ? <Default modal title="Strict" buttons={[{ label: 'OK', onClick: () => setOpen(false) }]} /> : null
  }
  const root = createRoot(host)
  root.render(<StrictMode><App /></StrictMode>)
  await vi.waitFor(() => expect(toggle).toBeTypeOf('function'))
  for (let i = 0; i < 10; i++) {
    toggle()
    await vi.waitFor(() => expect(host.querySelector('.react-confirm-alert-overlay')).not.toBeNull())
    buttonByText('OK').click()
    await vi.waitFor(() => expect(host.querySelector('.react-confirm-alert-overlay')).toBeNull())
  }
  root.unmount()
  expect(consoleSpy.error).not.toHaveBeenCalled()
})
