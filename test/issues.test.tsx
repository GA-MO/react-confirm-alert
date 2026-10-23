import React, { createContext, useContext, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, onTestFinished, test, vi } from 'vitest'
import { server, userEvent } from 'vitest/browser'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { buttonByText, cleanupPage, loadV3, overlay, setupPage, spyConsole, waitForOverlay } from './v3'

// One test per open issue that a browser test can reproduce. Each is test.fails until the phase that
// fixes it (plan section 1), which turns it into a plain test. #38 waits for confirm() in P3.

let lib: any
let roots: Root[] = []

beforeEach(async () => {
  setupPage()
  lib = await loadV3()
})
afterEach(() => {
  for (const root of roots) root.unmount()
  roots = []
  vi.restoreAllMocks()
  cleanupPage()
})

function render(element: React.ReactElement) {
  const host = document.createElement('div')
  document.getElementById('app')!.append(host)
  const root = createRoot(host)
  roots.push(root)
  root.render(element)
  return host
}

test('#29 focus moves into the dialog and Tab reaches its buttons, not the page behind', async () => {
  document.getElementById('behind')!.focus()
  lib.confirmAlert({ title: 'Tab' })
  const el = await waitForOverlay()
  await vi.waitFor(() => expect(el.contains(document.activeElement)).toBe(true))
  await userEvent.tab()
  // WebKit only tabs to buttons when the macOS "use keyboard navigation" setting is on.
  if (server.browser !== 'webkit') expect(document.activeElement).toBe(buttonByText('Cancel'))
  expect(document.activeElement).not.toBe(document.getElementById('behind'))
  buttonByText('Cancel').click()
})

test('#31 with modal: true (or --rca-z-index) the dialog sits above a Bootstrap modal (z-index 1050)', async () => {
  // React-Bootstrap portals its modal to the end of body, outside the app root that v3 blurs.
  const modal = document.createElement('div')
  modal.style.cssText = 'position:fixed;inset:0;z-index:1050;background:rgba(0,0,0,.3)'
  document.body.append(modal)
  onTestFinished(() => modal.remove())
  // Without showModal there is no top layer, so the v3 overlay is raised with --rca-z-index instead.
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    document.documentElement.style.setProperty('--rca-z-index', '2000')
    onTestFinished(() => document.documentElement.style.removeProperty('--rca-z-index'))
  }
  lib.confirmAlert({ title: 'Above', modal: true })
  await waitForOverlay()
  await new Promise((resolve) => setTimeout(resolve, 800))
  const button = buttonByText('Cancel')
  const box = button.getBoundingClientRect()
  expect(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)).toBe(button)
  button.click()
})

test.fails('#38 line breaks in message are kept', async () => {
  expect(lib.confirm).toBeTypeOf('function')
  lib.confirm({ title: 'Lines', message: 'one\ntwo' })
  await vi.waitFor(() => expect(document.body.textContent).toContain('two'))
  const message = document.querySelector('[data-slot="message"]') as HTMLElement
  expect(getComputedStyle(message).whiteSpace).toBe('pre-line')
})

test.fails('#46 a dialog opened from inside another stacks on top of it', async () => {
  lib.confirmAlert({
    title: 'Parent',
    buttons: [
      {
        label: 'Open child',
        onClick: () => {
          lib.confirmAlert({ title: 'Child', strategy: 'stack' })
          return false
        }
      }
    ],
    strategy: 'stack'
  })
  await waitForOverlay()
  buttonByText('Open child').click()
  await vi.waitFor(() => expect(document.body.textContent).toContain('Child'))
  expect(document.body.textContent).toContain('Parent')
})

test.fails('#63 #66 a dialog reads the latest parent state', async () => {
  expect(lib.Dialog).toBeTypeOf('function')
  function Editor() {
    const [note, setNote] = useState('')
    return (
      <lib.Dialog open onOpenChange={() => {}} aria-label="Edit">
        <textarea aria-label="note" value={note} onChange={(e) => setNote(e.target.value)} />
        <button disabled={!note}>Save</button>
      </lib.Dialog>
    )
  }
  render(<Editor />)
  await vi.waitFor(() => expect(document.querySelector('textarea')).not.toBeNull())
  await userEvent.fill(document.querySelector('textarea')!, 'hello')
  expect(buttonByText('Save').disabled).toBe(false)
})

test('#77 the page is blurred on every open, not only the first', async () => {
  lib.confirmAlert({ title: 'First' })
  await waitForOverlay()
  buttonByText('Cancel').click()
  lib.confirmAlert({ title: 'Second' })
  await waitForOverlay()
  expect(document.getElementById('app')!.classList.contains('react-confirm-alert-blur')).toBe(true)
  buttonByText('Cancel').click()
})

test('#82 calling confirmAlert while a dialog is open logs no createRoot error', async () => {
  const consoleSpy = spyConsole()
  lib.confirmAlert({ title: 'First' })
  await waitForOverlay()
  lib.confirmAlert({ title: 'Second' })
  await vi.waitFor(() => expect(overlay()!.textContent).toContain('Second'))
  expect(consoleSpy.error).not.toHaveBeenCalled()
})

test('#84 #89 onkeyPress receives the keyboard event and a close function', async () => {
  const onkeyPress = vi.fn()
  lib.confirmAlert({ title: 'Key', onkeyPress })
  await waitForOverlay()
  await userEvent.keyboard('a')
  expect(onkeyPress.mock.calls[0][0]).toBeInstanceOf(KeyboardEvent)
  expect(typeof onkeyPress.mock.calls[0][1]).toBe('function')
})

test('#92 pressing inside and releasing outside does not close', async () => {
  const onClickOutside = vi.fn()
  lib.confirmAlert({ title: 'Drag', onClickOutside })
  const el = await waitForOverlay()
  const title = document.querySelector('.react-confirm-alert-body h1')!
  // The event sequence Chrome produces when a drag starts on the title and ends on the overlay.
  title.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
  title.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
  el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  expect(onClickOutside).not.toHaveBeenCalled()
  expect(overlay()).not.toBeNull()
})

test.fails('#93 changing dismissKey closes open dialogs', async () => {
  expect(lib.DialogHost).toBeTypeOf('function')
  function App() {
    const [path, setPath] = useState('/a')
    return (
      <>
        <button onClick={() => setPath('/b')}>Navigate</button>
        <lib.DialogHost dismissKey={path} />
      </>
    )
  }
  render(<App />)
  lib.confirmAlert({ title: 'Route' })
  await waitForOverlay()
  await userEvent.click(buttonByText('Navigate'))
  await vi.waitFor(() => expect(overlay()).toBeNull())
})

test.fails('#94 #23 #35 #28 a dialog reads context from providers around DialogHost', async () => {
  expect(lib.DialogHost).toBeTypeOf('function')
  const Store = createContext('missing')
  function Reader() {
    return <p id="reader">{useContext(Store)}</p>
  }
  render(
    <Store.Provider value="from-provider">
      <lib.DialogHost />
    </Store.Provider>
  )
  lib.confirmAlert({ customUI: () => <Reader /> })
  await vi.waitFor(() => expect(document.getElementById('reader')!.textContent).toBe('from-provider'))
})

// Not a bug test. It records the likely cause of "nothing shows the first time" in #82 (plan section 1):
// without the CSS, the overlay renders as a plain block at the end of body, below a tall page.
test('#82 without the CSS the first dialog renders out of view on a tall page', async () => {
  for (const sheet of Array.from(document.styleSheets)) sheet.disabled = true
  document.getElementById('app')!.style.height = '5000px'
  lib.confirmAlert({ title: 'Below' })
  const el = await waitForOverlay()
  expect(el.getBoundingClientRect().top).toBeGreaterThan(window.innerHeight)
  buttonByText('Cancel').click()
  for (const sheet of Array.from(document.styleSheets)) sheet.disabled = false
})
