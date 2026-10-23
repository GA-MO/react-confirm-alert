import React, { act, type ComponentType, type ReactElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import 'react-confirm-alert/src/react-confirm-alert.css'
import preflight from 'tailwindcss/preflight.css?raw'
import { alert, closeAll, configureDialogs, confirm, confirmAlert, Dialog, DialogLayout, openDialog, prompt } from 'react-confirm-alert'
import { Colors, NoteDialog } from '../website/components/playground/dialogs'

// Every docs example, playground example and plain-HTML dialog content must show its controls and
// title, even under Tailwind preflight, which strips borders, backgrounds and heading sizes.
const modules = import.meta.glob<Record<string, unknown>>(['../website/components/examples/*.tsx', '../website/components/custom-ui/*.tsx'], { eager: true })
const exampleComponents = Object.entries(modules).flatMap(([file, mod]) =>
  Object.entries(mod)
    .filter((entry): entry is [string, ComponentType] => typeof entry[1] === 'function')
    .map(([name, component]) => ({ name: `${file.split('/').pop()} ${name}`, component })))

const Plain = ({ heading = true }: { heading?: boolean }) => (
  <>
    {heading && <h1>Plain title</h1>}
    <p>Plain text.</p>
    <label htmlFor='plain-input'>Name</label>
    <input id='plain-input' />
    <textarea aria-label='Note' />
    <select aria-label='Role'><option>Viewer</option></select>
    <button>Plain button</button>
  </>
)

const contentCases: { name: string, open: (mount: (el: ReactElement) => void) => void }[] = [
  { name: 'playground <Dialog open> with state', open: (mount) => mount(<NoteDialog open onOpenChange={() => {}} onSave={() => {}} />) },
  { name: 'playground openDialog() typed result', open: () => { void openDialog<string>({ render: ({ close }) => <Colors close={close} /> }).result } },
  { name: 'openDialog with plain elements', open: () => { void openDialog({ render: () => <Plain /> }).result } },
  { name: 'openDialog with DialogLayout', open: () => { void openDialog({ render: () => <DialogLayout title='Layout' actions={[{ label: 'OK', variant: 'primary' }]}><Plain heading={false} /></DialogLayout> }).result } },
  { name: '<Dialog> with plain elements', open: (mount) => mount(<Dialog open onOpenChange={() => {}} aria-label='Plain'><Plain /></Dialog>) },
  { name: 'confirm with content', open: () => { void confirm({ title: 'Confirm', content: <Plain heading={false} /> }) } },
  { name: 'alert with content', open: () => { void alert({ title: 'Alert', content: <Plain heading={false} /> }) } },
  { name: 'prompt with content', open: () => { void prompt({ title: 'Prompt', label: 'Value', content: <Plain heading={false} />, validate: () => null }) } },
  { name: 'confirmAlert customUI with skin', open: () => confirmAlert({ skin: true, customUI: () => <Plain /> }) },
  {
    name: 'confirmAlert customUI with the skin default',
    open: () => {
      configureDialogs({ confirmAlert: { skin: true } })
      confirmAlert({ customUI: () => <Plain /> })
    }
  }
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
  configureDialogs({})
  await vi.waitFor(() => expect(document.querySelector('[data-rca]')).toBeNull())
}

async function waitForDialog (): Promise<HTMLElement | null> {
  try {
    return await vi.waitFor(() => Array.from(document.querySelectorAll<HTMLElement>('[data-rca]')).at(-1) ?? Promise.reject(new Error('no dialog')), { timeout: 500 })
  } catch {
    return null
  }
}

const titleColor = { light: 'rgb(9, 9, 11)', dark: 'rgb(250, 250, 250)' }

function expectVisibleContent (dialog: HTMLElement, theme: keyof typeof titleColor): number {
  // confirmAlert without skin keeps the 3.0 look, which the v3 contract tests cover.
  if (!dialog.hasAttribute('data-skin')) return 0
  const panel = dialog.querySelector<HTMLElement>('[data-slot=panel]')!
  const controls = Array.from(dialog.querySelectorAll<HTMLElement>('input:not([type=radio], [type=checkbox]), textarea, select'))
  for (const control of controls) {
    const style = getComputedStyle(control)
    expect(parseFloat(style.borderTopWidth), `${control.tagName} border`).toBeGreaterThan(0)
    expect(control.offsetWidth, `${control.tagName} width vs panel ${panel.offsetWidth}`).toBeGreaterThanOrEqual(panel.offsetWidth * 0.8)
    if (control instanceof HTMLTextAreaElement) {
      expect(style.resize).toBe('vertical')
      expect(control.offsetHeight).toBeGreaterThanOrEqual(80)
    }
  }
  for (const button of Array.from(dialog.querySelectorAll<HTMLElement>('button'))) {
    expect(button.offsetHeight, `button "${button.textContent}" height`).toBeGreaterThanOrEqual(36)
  }
  const title = dialog.querySelector<HTMLElement>('h1, h2, h3')
  if (controls.length > 0) expect(title, 'a dialog with a control has a title').not.toBeNull()
  if (title) {
    const style = getComputedStyle(title)
    expect(parseFloat(style.fontSize)).toBeGreaterThanOrEqual(18)
    expect(Number(style.fontWeight)).toBeGreaterThanOrEqual(600)
    expect(style.color).toBe(titleColor[theme])
  }
  return controls.length
}

for (const withPreflight of [false, true]) {
  for (const theme of ['light', 'dark'] as const) {
    describe(`${theme}, ${withPreflight ? 'with' : 'without'} Tailwind preflight`, () => {
      let style: HTMLStyleElement | undefined
      // Unlayered and after the library CSS: the harshest order, where only specificity can win.
      beforeEach(() => {
        if (withPreflight) style = document.head.appendChild(Object.assign(document.createElement('style'), { textContent: preflight }))
        document.documentElement.classList.toggle('dark', theme === 'dark')
      })
      afterEach(async () => {
        await unmount()
        style?.remove()
        document.documentElement.classList.remove('dark')
      })

      test('docs and playground examples: every dialog shows its controls and title', async () => {
        let checked = 0
        for (const { name, component: Component } of exampleComponents) {
          mount(<Component />)
          const openers = host!.querySelectorAll('button').length
          await unmount()
          for (let i = 0; i < openers; i++) {
            mount(<Component />)
            act(() => host!.querySelectorAll('button')[i]!.click())
            const dialog = await waitForDialog()
            if (dialog) checked += expectVisibleContent(dialog, theme)
            await unmount()
          }
          expect(document.querySelector('[data-rca]'), name).toBeNull()
        }
        // A glob that found nothing would pass silently: edit-note, rename-prompt and the rename, delete and invite variants.
        expect(checked).toBeGreaterThanOrEqual(18)
      })

      test.each(contentCases)('$name: controls and title are visible', async ({ open }) => {
        open(mount)
        const dialog = await waitForDialog()
        expect(dialog).not.toBeNull()
        expect(expectVisibleContent(dialog!, theme)).toBeGreaterThan(0)
      })
    })
  }
}

describe('your classes win over the automatic styles', () => {
  let style: HTMLStyleElement
  beforeEach(() => {
    style = document.head.appendChild(Object.assign(document.createElement('style'), {
      textContent: '.mine { border-width: 0; width: 50px } .mine-button { background-color: rgb(1, 2, 3); height: 20px } .mine-title { font-size: 11px }'
    }))
  })
  afterEach(async () => {
    await unmount()
    style.remove()
  })

  test('a single class beats the plain element rules', async () => {
    void openDialog({
      render: () => (
        <div className='react-confirm-alert-body'>
          <h1 className='mine-title'>Mine</h1>
          <input className='mine' aria-label='Mine' />
          <button className='mine-button'>Mine</button>
        </div>
      )
    }).result
    const dialog = (await waitForDialog())!
    const input = getComputedStyle(dialog.querySelector('input')!)
    expect(input.borderTopWidth).toBe('0px')
    expect(input.width).toBe('50px')
    const button = getComputedStyle(dialog.querySelector('button')!)
    expect(button.backgroundColor).toBe('rgb(1, 2, 3)')
    expect(button.height).toBe('20px')
    expect(getComputedStyle(dialog.querySelector('h1')!).fontSize).toBe('11px')
  })

  test('unstyled turns the automatic styles off', async () => {
    void openDialog({ unstyled: true, render: () => <><h1>Bare</h1><input aria-label='Bare' /></> }).result
    const dialog = (await waitForDialog())!
    expect(dialog.hasAttribute('data-skin')).toBe(true)
    expect(getComputedStyle(dialog.querySelector('input')!).height).not.toBe('36px')
    expect(getComputedStyle(dialog.querySelector('h1')!).fontSize).not.toBe('18px')
  })

  test('confirmAlert without skin keeps the 3.0 markup and look', async () => {
    confirmAlert({ customUI: () => <div className='custom-ui'><h1>Old</h1><button>Old</button></div> })
    const dialog = (await waitForDialog())!
    expect(dialog.hasAttribute('data-skin')).toBe(false)
    expect(dialog.querySelector('.react-confirm-alert-body')).toBeNull()
    expect(getComputedStyle(dialog.querySelector('button')!).height).not.toBe('36px')
  })
})
