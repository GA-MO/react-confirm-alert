import { expect, test } from 'vitest'
import { snippet } from '../website/components/playground/snippet'

// The playground code panel has no horizontal scroll at 1280px: every line it can show fits in 70 columns.
const sources = import.meta.glob<string>('../website/components/custom-ui/*.tsx', { eager: true, query: '?raw', import: 'default' })
const options = { title: 'Delete file?', message: 'This cannot be undone.', danger: true, modal: true, closeOnEscape: true, closeOnClickOutside: true }
const scenarios = ['confirm', 'alert', 'prompt', 'async', 'stack', 'queue', 'closeAll', 'route', 'inline', 'custom', 'v3', 'customUI']
const styles = ['default', 'variables', 'mixed', 'tailwind'] as const

const tooLong = (code: string) => code.split('\n').filter((line) => line.length > 70)

test('every custom UI example file fits in 70 columns', () => {
  expect(Object.keys(sources).length).toBe(16)
  for (const [file, code] of Object.entries(sources)) expect(tooLong(code), file).toEqual([])
})

test('every generated snippet fits in 70 columns', () => {
  for (const id of scenarios) for (const style of styles) expect(tooLong(snippet(id, options, style, 400)), `${id} ${style}`).toEqual([])
})
