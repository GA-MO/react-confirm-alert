import { vi } from 'vitest'

declare const __RCA_ENTRY__: string

let instance = 0

// Each test gets its own copy of the module, so v3's module-level `root` never leaks between tests.
export async function loadV3(): Promise<any> {
  // The library keeps its page state on globalThis (shared by ESM and CJS copies). Each test starts clean.
  // Unmount what an earlier test left open first: ids restart at rca-1 in a fresh runtime, so a leftover
  // dialog's keydown listener would treat this test's dialog as its own and close it.
  const key = Symbol.for('react-confirm-alert/runtime')
  const previous = (globalThis as any)[key]
  previous?.containers.forEach((c: { root: { unmount: () => void } }) => c.root.unmount())
  delete (globalThis as any)[key]
  instance += 1
  return import(/* @vite-ignore */ `/${__RCA_ENTRY__}?instance=${instance}`)
}

export function setupPage() {
  const app = document.createElement('div')
  app.id = 'app'
  app.innerHTML = '<button id="behind">behind</button>'
  document.body.prepend(app)
  return app
}

export function cleanupPage() {
  for (const id of ['app', 'react-confirm-alert', 'react-confirm-alert-firm-svg', 'target']) {
    document.getElementById(id)?.remove()
  }
  document.body.classList.remove('react-confirm-alert-body-element')
  for (const el of Array.from(document.body.children)) el.classList.remove('react-confirm-alert-blur')
}

export const overlay = () => document.querySelector<HTMLElement>('.react-confirm-alert-overlay')

export async function waitForOverlay() {
  // createRoot renders asynchronously; a slow CI runner can take well over the default 1 s.
  await vi.waitFor(() => {
    if (!overlay()) throw new Error('overlay not rendered')
  }, { timeout: 5000, interval: 20 })
  return overlay()!
}

export function buttonByText(text: string) {
  const button = Array.from(document.querySelectorAll('button')).find((b) => b.textContent === text)
  if (!button) throw new Error(`no button "${text}"`)
  return button
}

export function spyConsole() {
  return {
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {})
  }
}
