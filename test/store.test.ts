import { describe, expect, test } from 'vitest'
import { beginClose, emptyState, promoteQueued, push, remove, topmost, type Entry, type StoreState } from '../src/store'
import type { DialogId } from '../src/types'

const entry = (id: string): Omit<Entry, 'phase'> => ({
  id: id as DialogId,
  options: { kind: 'custom', render: () => null },
  target: null,
  blur: false,
  settle: () => {}
})
const phases = (state: StoreState) => state.entries.map((e) => `${e.id}:${e.phase}`)

describe('push', () => {
  test('stack opens on top of what is open', () => {
    const state = push(push(emptyState, entry('a'), 'stack'), entry('b'), 'stack')
    expect(phases(state)).toEqual(['a:open', 'b:open'])
    expect(topmost(state)?.id).toBe('b')
  })

  test('queue waits while something is visible, and opens at once when nothing is', () => {
    expect(phases(push(emptyState, entry('a'), 'queue'))).toEqual(['a:open'])
    const state = push(push(emptyState, entry('a'), 'stack'), entry('b'), 'queue')
    expect(phases(state)).toEqual(['a:open', 'b:queued'])
  })

  test('replace starts closing every open entry', () => {
    const state = push(push(emptyState, entry('a'), 'stack'), entry('b'), 'replace')
    expect(phases(state)).toEqual(['a:closing', 'b:open'])
  })
})

describe('beginClose', () => {
  test('moves an open entry to closing', () => {
    const state = beginClose(push(emptyState, entry('a'), 'stack'), 'a' as DialogId)
    expect(phases(state)).toEqual(['a:closing'])
  })

  test('is a no-op on a closing, queued or unknown entry', () => {
    const closing = beginClose(push(emptyState, entry('a'), 'stack'), 'a' as DialogId)
    expect(beginClose(closing, 'a' as DialogId)).toBe(closing)
    const queued = push(push(emptyState, entry('a'), 'stack'), entry('b'), 'queue')
    expect(beginClose(queued, 'b' as DialogId)).toBe(queued)
    expect(beginClose(queued, 'x' as DialogId)).toBe(queued)
  })
})

describe('remove', () => {
  test('removes a closing entry and promotes the next queued one', () => {
    let state = push(push(emptyState, entry('a'), 'stack'), entry('b'), 'queue')
    state = remove(beginClose(state, 'a' as DialogId), 'a' as DialogId)
    expect(phases(state)).toEqual(['b:open'])
  })

  test('cancels a queued entry directly', () => {
    const state = push(push(emptyState, entry('a'), 'stack'), entry('b'), 'queue')
    expect(phases(remove(state, 'b' as DialogId))).toEqual(['a:open'])
  })

  test('refuses to remove an open entry, which must close first', () => {
    const state = push(emptyState, entry('a'), 'stack')
    expect(remove(state, 'a' as DialogId)).toBe(state)
  })
})

test('promoteQueued leaves the state alone while an entry is visible', () => {
  const state = push(push(emptyState, entry('a'), 'stack'), entry('b'), 'queue')
  expect(promoteQueued(state)).toBe(state)
})
