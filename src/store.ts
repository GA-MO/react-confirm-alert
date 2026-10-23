import type { Root } from 'react-dom/client'
import type { DialogId, DialogOptions, Strategy } from './types'

export type Phase = 'queued' | 'open' | 'closing'

export interface Entry {
  id: DialogId
  // R is erased here and restored by the caller that created the entry.
  options: DialogOptions<any>
  phase: Phase
  /** id of the element the dialog renders into, or null for the default container */
  target: string | null
  /** v3 blurs body.children[0] only when the library created the default container */
  blur: boolean
  settle: (result: unknown) => void
}

export interface StoreState {
  entries: readonly Entry[]
}

export const emptyState: StoreState = { entries: [] }

const isVisible = (entry: Entry) => entry.phase !== 'queued'

export function push (state: StoreState, entry: Omit<Entry, 'phase'>, strategy: Strategy): StoreState {
  const busy = state.entries.some(isVisible)
  if (strategy === 'queue' && busy) {
    return { entries: [...state.entries, { ...entry, phase: 'queued' }] }
  }
  const entries = strategy === 'replace'
    ? state.entries.map((e) => (e.phase === 'open' ? { ...e, phase: 'closing' as const } : e))
    : state.entries
  return { entries: [...entries, { ...entry, phase: 'open' }] }
}

// Only an open entry can start closing. Anything else returns the same state, so a second
// close request for the same dialog (Esc in keyCodeForClose, a double click) changes nothing.
export function beginClose (state: StoreState, id: DialogId): StoreState {
  const entry = state.entries.find((e) => e.id === id)
  if (!entry || entry.phase !== 'open') return state
  return { entries: state.entries.map((e) => (e === entry ? { ...e, phase: 'closing' } : e)) }
}

// A closing entry leaves the store; a queued one may be cancelled directly.
export function remove (state: StoreState, id: DialogId): StoreState {
  const entry = state.entries.find((e) => e.id === id)
  if (!entry || entry.phase === 'open') return state
  return promoteQueued({ entries: state.entries.filter((e) => e !== entry) })
}

export function promoteQueued (state: StoreState): StoreState {
  if (state.entries.some(isVisible)) return state
  const next = state.entries.find((e) => e.phase === 'queued')
  if (!next) return state
  return { entries: state.entries.map((e) => (e === next ? { ...e, phase: 'open' } : e)) }
}

export function topmost (state: StoreState): Entry | undefined {
  return [...state.entries].reverse().find((e) => e.phase === 'open')
}

export interface Store {
  get: () => StoreState
  set: (next: StoreState) => void
  subscribe: (listener: () => void) => () => void
  nextId: () => DialogId
}

interface Container {
  element: HTMLElement
  root: Root
  created: boolean
}

// Everything the library keeps per page lives in one object on globalThis, so an ESM and a CJS
// copy of the package loaded together share it, and dropping it gives a clean page.
export interface Runtime {
  state: StoreState
  counter: number
  listeners: Set<() => void>
  containers: Map<string | null, Container>
  frames: Map<DialogId, { frame: HTMLElement, panel: HTMLElement | null }>
  blurred: Element | null
  pageSynced: boolean
  watchingContainers: boolean
}

const key = Symbol.for('react-confirm-alert/runtime')
const scope = globalThis as typeof globalThis & { [key]?: Runtime }

export function runtime (): Runtime {
  return scope[key] ??= {
    state: emptyState,
    counter: 0,
    listeners: new Set(),
    containers: new Map(),
    frames: new Map(),
    blurred: null,
    pageSynced: false,
    watchingContainers: false
  }
}

export const store: Store = {
  get: () => runtime().state,
  set (next) {
    const rt = runtime()
    if (next === rt.state) return
    rt.state = next
    for (const listener of [...rt.listeners]) listener()
  },
  subscribe (listener) {
    const { listeners } = runtime()
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
  nextId: () => `rca-${++runtime().counter}` as DialogId
}
