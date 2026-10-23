import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import 'react-confirm-alert/src/react-confirm-alert.css'
import {
  buttonByText,
  cleanupPage,
  loadV3,
  overlay,
  setupPage,
  spyConsole,
  waitForOverlay
} from './v3'

let lib: any

beforeEach(async () => {
  setupPage()
  lib = await loadV3()
})
afterEach(() => {
  vi.restoreAllMocks()
  cleanupPage()
})

describe('imports', () => {
  test('confirmAlert is a function and the default export is a class component', () => {
    expect(typeof lib.confirmAlert).toBe('function')
    expect(lib.default.prototype.isReactComponent).toBeTruthy()
  })

  test('the v3 CSS path applies the overlay styles', async () => {
    lib.confirmAlert({ title: 'Styled' })
    const el = await waitForOverlay()
    expect(getComputedStyle(el).position).toBe('fixed')
    buttonByText('Cancel').click()
  })

  test('confirmAlert returns undefined', () => {
    const result = lib.confirmAlert({ title: 'Return' })
    expect(result).toBeUndefined()
  })
})

describe('DOM', () => {
  test('renders the v3 structure at the end of body', async () => {
    lib.confirmAlert({
      title: 'Title',
      message: 'Message',
      childrenElement: () => <span id="child">child</span>,
      buttons: [{ label: 'Yes', id: 'yes', className: 'yes-class', 'data-x': '1' }, { label: 'No' }]
    })
    const el = await waitForOverlay()
    const container = document.getElementById('react-confirm-alert')!
    expect(document.body.lastElementChild).toBe(container)
    expect(el.parentElement).toBe(container)
    expect(el.tagName).toBe('DIV')
    const body = el.querySelector(':scope > .react-confirm-alert > .react-confirm-alert-body')!
    expect(body.querySelector(':scope > h1')!.textContent).toBe('Title')
    expect(body.textContent).toContain('Message')
    expect(body.querySelector('#child')).not.toBeNull()
    const buttons = body.querySelectorAll(':scope > .react-confirm-alert-button-group > button')
    expect(Array.from(buttons).map((b) => b.textContent)).toEqual(['Yes', 'No'])
    const yes = buttons[0] as HTMLButtonElement
    expect(yes.id).toBe('yes')
    expect(yes.className).toBe('yes-class')
    expect(yes.dataset.x).toBe('1')
    buttonByText('No').click()
  })

  test('shows Cancel and Confirm when buttons are not given', async () => {
    lib.confirmAlert({ title: 'Defaults' })
    await waitForOverlay()
    const labels = Array.from(document.querySelectorAll('.react-confirm-alert-button-group button')).map((b) => b.textContent)
    expect(labels).toEqual(['Cancel', 'Confirm'])
    buttonByText('Cancel').click()
  })

  test('overlayClassName is added to the overlay', async () => {
    lib.confirmAlert({ title: 'Class', overlayClassName: 'my-overlay' })
    const el = await waitForOverlay()
    expect(el.classList.contains('my-overlay')).toBe(true)
    buttonByText('Cancel').click()
  })

  test('targetId renders into the given element without blurring the page', async () => {
    const target = document.createElement('div')
    target.id = 'target'
    document.body.append(target)
    lib.confirmAlert({ title: 'Target', targetId: 'target' })
    const el = await waitForOverlay()
    expect(el.parentElement).toBe(target)
    expect(document.getElementById('react-confirm-alert')).toBeNull()
    expect(document.getElementById('app')!.classList.contains('react-confirm-alert-blur')).toBe(false)
    buttonByText('Cancel').click()
  })

  test('body classes are set while open and removed after close', async () => {
    lib.confirmAlert({ title: 'Body' })
    await waitForOverlay()
    expect(document.body.classList.contains('react-confirm-alert-body-element')).toBe(true)
    expect(document.body.children[0].classList.contains('react-confirm-alert-blur')).toBe(true)
    buttonByText('Cancel').click()
    expect(document.body.classList.contains('react-confirm-alert-body-element')).toBe(false)
    expect(document.getElementById('app')!.classList.contains('react-confirm-alert-blur')).toBe(false)
  })
})

describe('buttons and timing', () => {
  test('a button calls onClick with no arguments, then closes before the click returns', async () => {
    const calls: string[] = []
    const onClick = vi.fn((...args: unknown[]) => calls.push(`onClick:${args.length}`))
    lib.confirmAlert({
      title: 'Timing',
      buttons: [{ label: 'Yes', onClick }],
      willUnmount: () => calls.push('willUnmount'),
      afterClose: () => calls.push('afterClose')
    })
    await waitForOverlay()
    buttonByText('Yes').click()
    expect(calls).toEqual(['onClick:0', 'willUnmount', 'afterClose'])
    expect(overlay()).toBeNull()
  })

  test('an async onClick is not awaited', async () => {
    lib.confirmAlert({ title: 'Async', buttons: [{ label: 'Save', onClick: () => new Promise(() => {}) }] })
    await waitForOverlay()
    buttonByText('Save').click()
    expect(overlay()).toBeNull()
  })

  test('calling again while open replaces the first dialog', async () => {
    spyConsole()
    lib.confirmAlert({ title: 'First' })
    await waitForOverlay()
    lib.confirmAlert({ title: 'Second' })
    await vi.waitFor(() => expect(overlay()!.textContent).toContain('Second'))
    expect(document.querySelectorAll('.react-confirm-alert-overlay')).toHaveLength(1)
    expect(document.body.textContent).not.toContain('First')
    buttonByText('Cancel').click()
  })

  test('the replaced dialog gets willUnmount and afterClose once, with no console error (B21)', async () => {
    const consoleSpy = spyConsole()
    const first = { willUnmount: vi.fn(), afterClose: vi.fn() }
    lib.confirmAlert({ title: 'First', ...first })
    await waitForOverlay()
    lib.confirmAlert({ title: 'Second' })
    await vi.waitFor(() => expect(overlay()!.textContent).toContain('Second'))
    expect(first.willUnmount).toHaveBeenCalledTimes(1)
    expect(first.afterClose).toHaveBeenCalledTimes(1)
    expect(consoleSpy.error).not.toHaveBeenCalled()
  })

  test('afterClose runs once when Esc is also in keyCodeForClose (B21)', async () => {
    const afterClose = vi.fn()
    lib.confirmAlert({ title: 'Twice', keyCodeForClose: [27], afterClose })
    await waitForOverlay()
    await userEvent.keyboard('{Escape}')
    expect(afterClose).toHaveBeenCalledTimes(1)
  })
})

describe('keyboard', () => {
  test('Escape calls onKeypressEscape with the event and closes', async () => {
    const onKeypressEscape = vi.fn()
    lib.confirmAlert({ title: 'Esc', onKeypressEscape })
    await waitForOverlay()
    await userEvent.keyboard('{Escape}')
    expect(onKeypressEscape).toHaveBeenCalledTimes(1)
    expect(onKeypressEscape.mock.calls[0][0]).toBeInstanceOf(KeyboardEvent)
    expect(overlay()).toBeNull()
  })

  test('closeOnEscape: false keeps the dialog open', async () => {
    const onKeypressEscape = vi.fn()
    lib.confirmAlert({ title: 'NoEsc', closeOnEscape: false, onKeypressEscape })
    await waitForOverlay()
    await userEvent.keyboard('{Escape}')
    expect(onKeypressEscape).not.toHaveBeenCalled()
    expect(overlay()).not.toBeNull()
    buttonByText('Cancel').click()
  })

  test('keyCodeForClose closes on the listed key', async () => {
    lib.confirmAlert({ title: 'Space', keyCodeForClose: [32] })
    await waitForOverlay()
    await userEvent.keyboard(' ')
    expect(overlay()).toBeNull()
  })

  test('onkeyPress is called on any key', async () => {
    const onkeyPress = vi.fn()
    lib.confirmAlert({ title: 'Key', onkeyPress })
    await waitForOverlay()
    await userEvent.keyboard('a')
    expect(onkeyPress).toHaveBeenCalledTimes(1)
    buttonByText('Cancel').click()
  })
})

describe('clicks', () => {
  test('a click outside calls onClickOutside, closes, and does not reach document', async () => {
    const onClickOutside = vi.fn()
    const documentClick = vi.fn()
    document.addEventListener('click', documentClick)
    lib.confirmAlert({ title: 'Outside', onClickOutside })
    const el = await waitForOverlay()
    await userEvent.click(el, { position: { x: 5, y: 5 } })
    document.removeEventListener('click', documentClick)
    expect(onClickOutside).toHaveBeenCalledTimes(1)
    expect(overlay()).toBeNull()
    expect(documentClick).not.toHaveBeenCalled()
  })

  test('closeOnClickOutside: false keeps the dialog open', async () => {
    lib.confirmAlert({ title: 'Stay', closeOnClickOutside: false })
    const el = await waitForOverlay()
    await userEvent.click(el, { position: { x: 5, y: 5 } })
    expect(overlay()).not.toBeNull()
    buttonByText('Cancel').click()
  })

  test('a click inside the body does not close', async () => {
    lib.confirmAlert({ title: 'Inside' })
    await waitForOverlay()
    await userEvent.click(document.querySelector('.react-confirm-alert-body h1')!)
    expect(overlay()).not.toBeNull()
    buttonByText('Cancel').click()
  })
})

describe('customUI', () => {
  test('receives title, message, buttons and onClose, and onClose closes', async () => {
    const afterClose = vi.fn()
    let received: any
    lib.confirmAlert({
      title: 'T',
      message: 'M',
      afterClose,
      customUI: (props: any) => {
        received = props
        return (
          <div className="custom-ui">
            <button onClick={props.onClose}>Close custom</button>
          </div>
        )
      }
    })
    const el = await waitForOverlay()
    expect(el.querySelector('.react-confirm-alert > .custom-ui')).not.toBeNull()
    expect(received.title).toBe('T')
    expect(received.message).toBe('M')
    expect(received.buttons.map((b: any) => b.label)).toEqual(['Cancel', 'Confirm'])
    buttonByText('Close custom').click()
    expect(overlay()).toBeNull()
    expect(afterClose).toHaveBeenCalledTimes(1)
  })
})

describe('default export', () => {
  test('renders declaratively and the parent can unmount it from a button', async () => {
    const host = document.createElement('div')
    document.getElementById('app')!.append(host)
    const Default = lib.default
    function App() {
      const [show, setShow] = useState(true)
      return show ? <Default title="Declarative" buttons={[{ label: 'OK', onClick: () => setShow(false) }]} /> : null
    }
    const root = createRoot(host)
    root.render(<App />)
    await vi.waitFor(() => expect(host.querySelector('.react-confirm-alert-overlay')).not.toBeNull())
    buttonByText('OK').click()
    await vi.waitFor(() => expect(host.querySelector('.react-confirm-alert-overlay')).toBeNull())
    root.unmount()
  })
})

describe('focus', () => {
  test('focus moves to the panel, not to a button (B14)', async () => {
    document.getElementById('behind')!.focus()
    lib.confirmAlert({ title: 'Focus' })
    const el = await waitForOverlay()
    await vi.waitFor(() => expect(document.activeElement).toBe(el.querySelector('.react-confirm-alert')))
  })
})

describe('console', () => {
  test('one open and close logs no warning or error', async () => {
    const consoleSpy = spyConsole()
    lib.confirmAlert({ title: 'Quiet', keyCodeForClose: [8], onkeyPress: () => {} })
    await waitForOverlay()
    buttonByText('Confirm').click()
    expect(consoleSpy.warn).not.toHaveBeenCalled()
    expect(consoleSpy.error).not.toHaveBeenCalled()
  })
})
