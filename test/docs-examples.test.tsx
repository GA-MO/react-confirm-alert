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

test('README: Custom UI examples', async () => {
  expect(readme).toContain("<DialogLayout title=\"Pick a colour\" actions={[{ label: 'Cancel', onClick: dismiss }, { label: 'Blue', variant: 'primary', onClick: () => close('blue') }]}>")
  const colour = lib.openDialog({
    render: ({ close, dismiss }: any) => (
      <lib.DialogLayout title='Pick a colour' actions={[{ label: 'Cancel', onClick: dismiss }, { label: 'Blue', variant: 'primary', onClick: () => close('blue') }]}>
        <p>Used for the team badge.</p>
      </lib.DialogLayout>
    )
  }).result
  await vi.waitFor(() => buttonByText('Blue'))
  buttonByText('Blue').click()
  await expect(colour).resolves.toBe('blue')

  expect(readme).toContain('  skin: true,\n  customUI: ({ onClose }) => (')
  lib.confirmAlert({ skin: true, customUI: ({ onClose }: any) => <><h1>Leave the board?</h1><button onClick={onClose}>Stay</button></> })
  await vi.waitFor(() => buttonByText('Stay'))
  expect(overlay()!.hasAttribute('data-skin')).toBe(true)
  buttonByText('Stay').click()
  await vi.waitFor(() => expect(overlay()).toBeNull())
})
