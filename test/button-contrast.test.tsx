import React from 'react'
import { afterEach, beforeEach, expect, test } from 'vitest'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { commands, userEvent } from 'vitest/browser'
import { cleanupPage, loadV3, setupPage, waitForOverlay } from './v3'

type RGBA = [number, number, number, number]

const pointer = (commands as any).pointer as (action: 'hover' | 'down' | 'up', selector?: string) => Promise<void>

const canvas = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
canvas.canvas.width = canvas.canvas.height = 1

// Through a canvas, so rgb(), color(srgb ...) from color-mix and the rest all read the same way.
function parse (css: string): RGBA {
  canvas.clearRect(0, 0, 1, 1)
  canvas.fillStyle = css
  canvas.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data
  return [r!, g!, b!, a! / 255]
}

const over = ([r, g, b, a]: RGBA, [R, G, B]: RGBA): RGBA => [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a), 1]

const luminance = ([r, g, b]: RGBA) => {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * R! + 0.7152 * G! + 0.0722 * B!
}

// The colours as painted: the button's background over the panel, its text over that, and the
// button's opacity (and any ancestor's below the panel) fading both toward the panel.
function contrast (button: HTMLElement) {
  let panel = button.parentElement!
  let opacity = Number(getComputedStyle(button).opacity)
  while (parse(getComputedStyle(panel).backgroundColor)[3] < 1) {
    opacity *= Number(getComputedStyle(panel).opacity)
    panel = panel.parentElement!
  }
  const under = parse(getComputedStyle(panel).backgroundColor)
  const style = getComputedStyle(button)
  const bg = over(parse(style.backgroundColor), under)
  const fg = over(parse(style.color), bg)
  const [a, b] = [luminance(over([...fg.slice(0, 3), opacity] as RGBA, under)), luminance(over([...bg.slice(0, 3), opacity] as RGBA, under))]
  return { ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), color: style.color, background: style.backgroundColor }
}

const variants = [undefined, 'secondary', 'primary', 'danger'] as const
const kinds = ['enabled', 'disabled', 'busy'] as const

let lib: any
beforeEach(async () => {
  setupPage()
  lib = await loadV3()
  // No transitions, so each colour is read at its end value.
  await (commands as any).emulateReducedMotion('reduce')
})
afterEach(async () => {
  await pointer('up')
  document.documentElement.classList.remove('dark')
  lib.closeAll()
  cleanupPage()
  await (commands as any).emulateReducedMotion('no-preference')
})

test.each(['light', 'dark'])('every button variant keeps text at 4.5:1 or more at rest, hover, press, focus, busy and disabled (%s)', async (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  lib.openDialog({
    render: () => (
      <div className='react-confirm-alert-body'>
        <input id='start' aria-label='start' />
        <div className='react-confirm-alert-button-group' style={{ flexWrap: 'wrap' }}>
          {variants.flatMap((variant) => kinds.map((kind) => (
            <button
              key={`${variant}-${kind}`}
              id={`b-${variant ?? 'none'}-${kind}`}
              data-variant={variant}
              aria-busy={kind === 'busy' || undefined}
              disabled={kind !== 'enabled'}
            >
              Delete
            </button>
          )))}
        </div>
      </div>
    )
  })
  await waitForOverlay()
  expect(document.querySelector('.react-confirm-alert-overlay[data-skin]')).not.toBeNull()

  const failures: string[] = []
  const measure = (id: string, state: string) => {
    const button = document.getElementById(id)!
    if (state !== 'rest') expect(button.matches(`:${state}`), `${id} matches :${state}`).toBe(true)
    const { ratio, color, background } = contrast(button)
    if (!(ratio >= 4.5)) failures.push(`${id} ${state}: ${ratio.toFixed(2)} (${color} on ${background})`)
  }
  for (const variant of variants) {
    for (const kind of kinds) {
      const id = `b-${variant ?? 'none'}-${kind}`
      measure(id, 'rest')
      await pointer('hover', `#${id}`)
      measure(id, 'hover')
      await pointer('down')
      // A disabled button never becomes :active, so it stays measured as hovered.
      measure(id, kind === 'enabled' ? 'active' : 'hover')
      await pointer('up')
    }
  }
  // Keyboard focus, reached with real Tab presses: focus() from script is not :focus-visible in Firefox.
  await pointer('hover', '#start')
  document.getElementById('start')!.focus()
  const focusable = variants.map((variant) => `b-${variant ?? 'none'}-enabled`)
  const reached: string[] = []
  for (let i = 0; i < focusable.length; i++) {
    const from = document.activeElement as HTMLElement
    await userEvent.tab()
    // WebKit on macOS, like Safari, moves Tab to buttons only with Option held.
    if (document.activeElement?.tagName !== 'BUTTON') {
      from.focus()
      await userEvent.keyboard('{Alt>}{Tab}{/Alt}')
    }
    reached.push(document.activeElement!.id)
    measure(document.activeElement!.id, 'focus-visible')
  }
  expect(reached).toEqual(focusable)
  expect(failures).toEqual([])
})
