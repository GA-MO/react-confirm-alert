import React from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { classFor } from '../src/classNames'
import { buttonByText, cleanupPage, loadV3, setupPage, waitForOverlay } from './v3'

describe('classFor', () => {
  test('adds layers in order: built-in, app defaults, call options, extra', () => {
    expect(classFor('panel', [{ classNames: { panel: 'app' } }, { classNames: { panel: 'call' } }], 'extra'))
      .toBe('react-confirm-alert app call extra')
  })
  test('the narrowest layer that sets unstyled decides', () => {
    expect(classFor('panel', [{ unstyled: true }, {}])).toBeUndefined()
    expect(classFor('panel', [{ unstyled: true }, { unstyled: false }])).toBe('react-confirm-alert')
  })
  test('slots without a v3 class only get what the caller gives', () => {
    expect(classFor('button', [{}], 'v3-button')).toBe('v3-button')
    expect(classFor('title', [{}])).toBeUndefined()
  })
})

describe('in the browser', () => {
  let lib: any
  beforeEach(async () => {
    setupPage()
    lib = await loadV3()
  })
  afterEach(() => {
    lib.configureDialogs({})
    lib.closeAll()
    vi.restoreAllMocks()
    cleanupPage()
  })

  test('unstyled leaves no react-confirm-alert class or inline style in the dialog, even with the CSS loaded', async () => {
    lib.confirm({ title: 'Plain', message: 'm', unstyled: true, classNames: { panel: 'my-panel' } })
    const frame = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-rca]')
      if (!el) throw new Error('not open yet')
      return el
    })
    const all = [frame, ...Array.from(frame.querySelectorAll<HTMLElement>('*'))]
    expect(all.some((el) => Array.from(el.classList).some((c) => c.startsWith('react-confirm-alert')))).toBe(false)
    expect(all.some((el) => el.getAttribute('style'))).toBe(false)
    const panel = frame.querySelector<HTMLElement>('[data-slot="panel"]')!
    expect(panel.className).toBe('my-panel')
    // The overlay background only comes from the library CSS (browsers give a modal dialog fixed position anyway).
    expect(getComputedStyle(frame).backgroundColor).not.toBe('rgba(255, 255, 255, 0.9)')
  })

  test('every DialogSlot appears as data-slot in some kind', async () => {
    lib.confirm({ title: 'T', message: 'M' })
    lib.prompt({ title: 'P', label: 'L', validate: () => 'bad' })
    await vi.waitFor(() => expect(document.querySelector('input')).not.toBeNull())
    document.querySelector('form')!.requestSubmit()
    await vi.waitFor(() => expect(document.querySelector('[data-slot="error"]')).not.toBeNull())
    const slots = new Set(Array.from(document.querySelectorAll('[data-slot]')).map((e) => e.getAttribute('data-slot')))
    for (const slot of ['dialog', 'panel', 'body', 'title', 'message', 'actions', 'button', 'field', 'label', 'input', 'error']) {
      expect(slots.has(slot), slot).toBe(true)
    }
  })

  test('the frame exposes tone, depth and topmost, and confirmAlert classes come from configureDialogs', async () => {
    lib.configureDialogs({ classNames: { button: 'app-button' }, confirmAlert: { classNames: { panel: 'v3-panel' } } })
    lib.confirm({ title: 'One', tone: 'danger' })
    lib.confirm({ title: 'Two' })
    await vi.waitFor(() => expect(document.querySelectorAll('[data-rca]').length).toBe(2))
    const [one, two] = Array.from(document.querySelectorAll<HTMLElement>('[data-rca]'))
    expect(one!.dataset.tone).toBe('danger')
    expect(one!.dataset.depth).toBe('0')
    expect(one!.hasAttribute('data-topmost')).toBe(false)
    expect(two!.dataset.depth).toBe('1')
    expect(two!.hasAttribute('data-topmost')).toBe(true)
    expect(two!.querySelector('button')!.className).toBe('app-button')
    lib.closeAll()
    lib.confirmAlert({ title: 'Legacy' })
    const overlay = await waitForOverlay()
    expect(overlay.querySelector('.react-confirm-alert')!.className).toBe('react-confirm-alert v3-panel')
    buttonByText('Cancel').click()
  })

  test('closing waits for an exit transition on the panel before the dialog leaves', async () => {
    const style = document.createElement('style')
    style.textContent = '[data-state="closing"] [data-slot="panel"] { opacity: 0; transition: opacity 200ms; }'
    document.head.append(style)
    const result = lib.confirm({ title: 'Fade' })
    await vi.waitFor(() => buttonByText('Cancel'))
    buttonByText('Cancel').click()
    await new Promise((r) => setTimeout(r, 60))
    expect(document.querySelector('[data-rca]')?.getAttribute('data-state')).toBe('closing')
    await vi.waitFor(() => expect(document.querySelector('[data-rca]')).toBeNull(), { timeout: 2000 })
    await expect(result).resolves.toBe(false)
    style.remove()
  })
})
