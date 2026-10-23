import { afterEach, beforeEach, expect, test } from 'vitest'
import { cleanupPage, loadV3, setupPage, waitForOverlay } from './v3'

beforeEach(setupPage)
afterEach(cleanupPage)

test('v3 source loads and opens a dialog', async () => {
  const { confirmAlert } = await loadV3()
  confirmAlert({ title: 'Smoke' })
  const el = await waitForOverlay()
  expect(el.textContent).toContain('Smoke')
})
