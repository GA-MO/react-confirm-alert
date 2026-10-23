import React from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { buttonByText, cleanupPage, loadV3, setupPage } from './v3'

let lib: any

beforeEach(async () => {
  setupPage()
  lib = await loadV3()
})
afterEach(() => {
  lib.closeAll()
  vi.restoreAllMocks()
  cleanupPage()
})

const titles = () => Array.from(document.querySelectorAll('[data-slot="title"]')).map((t) => t.textContent)

test('confirm resolves true from the confirm button and has role alertdialog with its title', async () => {
  const result = lib.confirm({ title: 'Delete?', message: 'Gone for good' })
  await expect.element(page.getByRole('alertdialog', { name: 'Delete?' })).toBeInTheDocument()
  expect(document.activeElement).toBe(buttonByText('Confirm'))
  buttonByText('Confirm').click()
  await expect(result).resolves.toBe(true)
})

test('confirm resolves false on Escape, and danger focuses Cancel', async () => {
  const result = lib.confirm({ title: 'Risky', tone: 'danger' })
  await vi.waitFor(() => expect(document.activeElement).toBe(buttonByText('Cancel')))
  await userEvent.keyboard('{Escape}')
  await expect(result).resolves.toBe(false)
})

test('three dialogs, each opened from a click in the one below, close one at a time on Escape', async () => {
  const level = (n: number): void => {
    lib.openDialog({ render: () => <button onClick={() => level(n + 1)}>{`Level ${n}`}</button> })
  }
  const frames = () => document.querySelectorAll('[data-rca]').length
  level(1)
  await vi.waitFor(() => buttonByText('Level 1'))
  await userEvent.click(buttonByText('Level 1'))
  await vi.waitFor(() => buttonByText('Level 2'))
  await userEvent.click(buttonByText('Level 2'))
  await vi.waitFor(() => expect(frames()).toBe(3))
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(frames()).toBe(2))
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(frames()).toBe(1))
})

test('#72 three queued dialogs open one at a time in order', async () => {
  const first = lib.alert({ title: 'A', strategy: 'queue' })
  lib.alert({ title: 'B', strategy: 'queue' })
  lib.alert({ title: 'C', strategy: 'queue' })
  await vi.waitFor(() => expect(titles()).toEqual(['A']))
  buttonByText('OK').click()
  await first
  await vi.waitFor(() => expect(titles()).toEqual(['B']))
  buttonByText('OK').click()
  await vi.waitFor(() => expect(titles()).toEqual(['C']))
})

test('a busy button disables the others, and closeAll aborts it and settles every result', async () => {
  let seen!: AbortSignal
  const confirmed = lib.confirm({ title: 'Save?', onConfirm: ({ signal }: any) => { seen = signal; return new Promise(() => {}) } })
  const typed = lib.prompt({ title: 'Name', strategy: 'queue' })
  await vi.waitFor(() => expect(titles()).toEqual(['Save?']))
  buttonByText('Confirm').click()
  await vi.waitFor(() => expect(buttonByText('Confirm').getAttribute('aria-busy')).toBe('true'))
  expect(buttonByText('Cancel').disabled).toBe(true)
  await userEvent.keyboard('{Escape}')
  expect(titles()).toEqual(['Save?'])
  lib.closeAll()
  expect(seen.aborted).toBe(true)
  await expect(confirmed).resolves.toBe(false)
  await expect(typed).resolves.toBe(null)
  await vi.waitFor(() => expect(titles()).toEqual([]))
})

test('an async onConfirm closes with true when it resolves', async () => {
  let finish!: () => void
  const result = lib.confirm({ title: 'Async', onConfirm: () => new Promise<void>((r) => { finish = r }) })
  await vi.waitFor(() => expect(titles()).toEqual(['Async']))
  buttonByText('Confirm').click()
  finish()
  await expect(result).resolves.toBe(true)
})

test('prompt keeps the dialog open on a validate error, exposes it, then resolves the value', async () => {
  const result = lib.prompt({ title: 'Name', validate: (v: string) => (v ? null : 'Required') })
  await vi.waitFor(() => expect(document.querySelector('input')).not.toBeNull())
  const input = document.querySelector('input')!
  expect(document.activeElement).toBe(input)
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(input.getAttribute('aria-invalid')).toBe('true'))
  expect(document.getElementById(input.getAttribute('aria-describedby')!)!.textContent).toBe('Required')
  await userEvent.fill(input, 'Ada')
  await userEvent.keyboard('{Enter}')
  await expect(result).resolves.toBe('Ada')
})

test('openDialog returns a handle whose close() value is the result', async () => {
  const handle = lib.openDialog({
    title: 'Pick',
    render: ({ close }: any) => <button onClick={() => close('blue')}>Blue</button>
  })
  await vi.waitFor(() => expect(titles()).toEqual([]))
  await vi.waitFor(() => buttonByText('Blue'))
  handle.update({ title: 'Pick a colour' })
  buttonByText('Blue').click()
  await expect(handle.result).resolves.toBe('blue')
})

test('an aborted signal dismisses the dialog', async () => {
  const controller = new AbortController()
  const result = lib.confirm({ title: 'Abort me', signal: controller.signal })
  await vi.waitFor(() => expect(titles()).toEqual(['Abort me']))
  controller.abort()
  await expect(result).resolves.toBe(false)
})
