import React, { type ComponentType, type ReactElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import 'react-confirm-alert/src/react-confirm-alert.css'
import preflight from 'tailwindcss/preflight.css?raw'
import { closeAll, openDialog, prompt } from 'react-confirm-alert'
import { Colors, NoteDialog } from '../website/components/playground/dialogs'

// Every docs example and playground dialog with a form control must show that control, even under
// Tailwind preflight, which strips borders, backgrounds and heading sizes (the bare <textarea> bug).
const examples = import.meta.glob<Record<string, unknown>>('../website/components/examples/*.tsx', { eager: true })
const docsComponents = Object.entries(examples).flatMap(([file, mod]) =>
  Object.entries(mod)
    .filter((entry): entry is [string, ComponentType] => typeof entry[1] === 'function')
    .map(([name, component]) => ({ name: `${file.split('/').pop()} ${name}`, component })))

const playgroundDialogs: { name: string, open: (mount: (el: ReactElement) => void) => void }[] = [
  { name: '<Dialog open> with state', open: (mount) => mount(<NoteDialog open onOpenChange={() => {}} onSave={() => {}} />) },
  { name: 'openDialog() typed result', open: () => { void openDialog<string>({ render: ({ close }) => <Colors close={close} /> }).result } },
  { name: 'prompt() with validate', open: () => { void prompt({ title: 'Your name', label: 'Name', validate: (v) => (v.trim() ? null : 'Required') }) } }
]

let root: Root | undefined
let host: HTMLElement | undefined
const mount = (el: ReactElement) => {
  host = document.body.appendChild(document.createElement('div'))
  root = createRoot(host)
  act(() => root!.render(el))
}

async function unmount () {
  act(() => closeAll())
  act(() => root?.unmount())
  host?.remove()
  root = host = undefined
  await vi.waitFor(() => expect(document.querySelector('[data-rca]')).toBeNull())
}

const openDialogs = () => Array.from(document.querySelectorAll<HTMLElement>('[data-rca]'))

async function waitForDialog (): Promise<HTMLElement | null> {
  try {
    return await vi.waitFor(() => openDialogs().at(-1) ?? Promise.reject(new Error('no dialog')), { timeout: 500 })
  } catch {
    return null
  }
}

function expectVisibleControls (dialog: HTMLElement): number {
  const panel = dialog.querySelector<HTMLElement>('[data-slot=panel]')!
  const controls = Array.from(dialog.querySelectorAll<HTMLElement>('input, textarea, select'))
  for (const control of controls) {
    const style = getComputedStyle(control)
    expect(parseFloat(style.borderTopWidth), `${control.tagName} border`).toBeGreaterThan(0)
    expect(control.offsetWidth, `${control.tagName} width vs panel ${panel.offsetWidth}`).toBeGreaterThanOrEqual(panel.offsetWidth * 0.8)
    if (control instanceof HTMLTextAreaElement) {
      expect(style.resize).toBe('vertical')
      expect(control.offsetHeight).toBeGreaterThanOrEqual(80)
    }
  }
  if (controls.length > 0) {
    const title = dialog.querySelector<HTMLElement>('[data-slot=title]')
    expect(title, 'dialog with a control has a data-slot title').not.toBeNull()
    expect(parseFloat(getComputedStyle(title!).fontSize)).toBeGreaterThanOrEqual(18)
    expect(Number(getComputedStyle(title!).fontWeight)).toBeGreaterThanOrEqual(600)
  }
  return controls.length
}

for (const withPreflight of [false, true]) {
  describe(withPreflight ? 'with Tailwind preflight' : 'without Tailwind preflight', () => {
    let style: HTMLStyleElement | undefined
    // Unlayered and after the library CSS: the harshest order, where only specificity can win.
    beforeEach(() => {
      if (withPreflight) style = document.head.appendChild(Object.assign(document.createElement('style'), { textContent: preflight }))
    })
    afterEach(async () => {
      await unmount()
      style?.remove()
    })

    test('docs examples: every control in a dialog has a border and fills the panel', async () => {
      let checked = 0
      for (const { name, component: Component } of docsComponents) {
        mount(<Component />)
        const openers = host!.querySelectorAll('button').length
        await unmount()
        for (let i = 0; i < openers; i++) {
          mount(<Component />)
          act(() => host!.querySelectorAll('button')[i]!.click())
          const dialog = await waitForDialog()
          if (dialog) checked += expectVisibleControls(dialog)
          await unmount()
        }
        expect(document.querySelector('[data-rca]'), name).toBeNull()
      }
      // edit-note's textarea and rename-prompt's input; a glob that found nothing would pass silently.
      expect(checked).toBeGreaterThanOrEqual(2)
    })

    test.each(playgroundDialogs)('playground $name: every control has a border and fills the panel', async ({ open }) => {
      open(mount)
      const dialog = await waitForDialog()
      expect(dialog).not.toBeNull()
      expect(expectVisibleControls(dialog!)).toBeGreaterThan(0)
    })
  })
}
