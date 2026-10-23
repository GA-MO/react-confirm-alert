import { vi } from 'vitest'

let instance = 0

// Each test gets its own copy of the module, so v3's module-level `root` never leaks between tests.
export async function loadV3(): Promise<any> {
  instance += 1
  return import(/* @vite-ignore */ `/src/index.js?instance=${instance}`)
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
  await vi.waitFor(() => {
    if (!overlay()) throw new Error('overlay not rendered')
  })
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
