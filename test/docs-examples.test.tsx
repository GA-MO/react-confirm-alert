import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import readme from '../Readme.md?raw'
import { buttonByText, cleanupPage, loadV3, overlay, setupPage } from './v3'

// Each example runs here and must appear in the README word for word, so the README cannot drift.
let lib: any
beforeEach(async () => {
  setupPage()
  lib = await loadV3()
})
afterEach(() => {
  lib.closeAll()
  cleanupPage()
})

test('README: confirm example', async () => {
  const snippet = "if (await confirm({ title: 'Delete file?', message: 'This cannot be undone.', tone: 'danger' })) {"
  expect(readme).toContain(snippet)
  const result = lib.confirm({ title: 'Delete file?', message: 'This cannot be undone.', tone: 'danger' })
  await vi.waitFor(() => buttonByText('Confirm'))
  buttonByText('Confirm').click()
  await expect(result).resolves.toBe(true)
})

test('README: v3 confirmAlert example', async () => {
  expect(readme).toContain("    { label: 'Yes', onClick: () => alert('Click Yes') },")
  const clicked = vi.fn()
  lib.confirmAlert({
    title: 'Confirm to submit',
    message: 'Are you sure to do this.',
    buttons: [
      { label: 'Yes', onClick: () => clicked('Click Yes') },
      { label: 'No', onClick: () => clicked('Click No') }
    ]
  })
  await vi.waitFor(() => buttonByText('Yes'))
  buttonByText('Yes').click()
  expect(clicked).toHaveBeenCalledWith('Click Yes')
  expect(overlay()).toBeNull()
})

test('README: Tailwind classNames example', async () => {
  expect(readme).toContain("confirm({ title: 'Publish?', classNames: { button: 'rounded-full bg-red-500' } })")
  lib.confirm({ title: 'Publish?', classNames: { button: 'rounded-full bg-red-500' } })
  await vi.waitFor(() => buttonByText('Confirm'))
  expect(buttonByText('Confirm').className).toBe('rounded-full bg-red-500')
})
