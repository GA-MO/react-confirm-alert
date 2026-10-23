import { flushSync } from 'react-dom'
import { beginClose, push, remove, runtime, store, type Entry } from './store'
import type { DialogId, EntryOptions, Strategy } from './types'
import { ensureContainer } from './fallbackRoot'

type Mounted = { frame: HTMLElement, panel: HTMLElement | null }

export function registerFrame (id: DialogId, frame: HTMLElement | null, panel: HTMLElement | null) {
  if (frame) runtime().frames.set(id, { frame, panel })
  else runtime().frames.delete(id)
}

export function openEntry (options: EntryOptions, target: string | null, strategy: Strategy, settle: (result: unknown) => void = () => {}) {
  const id = store.nextId()
  const resolved = ensureContainer(target)
  const entry: Omit<Entry, 'phase'> = { id, options, target: resolved.target, blur: !!options.legacy && resolved.blur, settle }
    const before = store.get().entries.filter((e) => e.phase === 'open').map((e) => e.id)
  store.set(push(store.get(), entry, strategy))
  if (strategy === 'replace') for (const old of before) store.set(remove(store.get(), old))
  return id
}

// Runs a store update and renders it before returning, so a close from a click handler leaves the
// DOM, body classes and v3 callbacks (willUnmount, then afterClose) settled when the click returns.
// flushSync only runs while the browser dispatches an event; from an effect or a timer it would warn.
function commit (update: () => void, sync: boolean) {
  if (sync && typeof window !== 'undefined' && window.event !== undefined) flushSync(update)
  else update()
}

export function closeDialog (id: DialogId, { sync = true } = {}) {
  const entry = store.get().entries.find((e) => e.id === id)
  if (!entry) return
  // Settling first resolves the caller's Promise with the dismiss value and aborts a busy button.
  entry.settle(undefined)
  if (entry.phase === 'queued') {
    commit(() => store.set(remove(store.get(), id)), sync)
    return
  }
  const node = runtime().frames.get(id)
  const before = new Set(node ? animationsOf(node) : [])
  commit(() => store.set(beginClose(store.get(), id)), sync)
  const exits = node ? animationsOf(node).filter((a) => !before.has(a)) : []
  if (exits.length === 0) {
    commit(() => store.set(remove(store.get(), id)), sync)
    return
  }
  Promise.all(exits.map((a) => a.finished)).finally(() => store.set(remove(store.get(), id)))
}

// Chrome and Safari group modal dialogs opened without a user gesture in between, and a repeated
// Escape closes the whole group with uncancelable cancel events. Frames that must stay open are
// shown again here, in store order, so the stacking order in the top layer does not change.
let reopenQueued = false
export function reopenClosedFrames () {
  if (reopenQueued) return
  reopenQueued = true
  queueMicrotask(() => {
    reopenQueued = false
    for (const entry of store.get().entries) {
      const frame = runtime().frames.get(entry.id)?.frame
      if (entry.phase === 'open' && frame instanceof HTMLDialogElement && !frame.open) frame.showModal()
    }
  })
}

// Only animations on the frame, its ::backdrop and the panel count. Children can run endless
// animations (a spinner) that would keep the dialog open forever.
function animationsOf ({ frame, panel }: Mounted): Animation[] {
  if (typeof frame.getAnimations !== 'function') return []
  return frame.getAnimations({ subtree: true }).filter((a) => {
    const target = (a.effect as KeyframeEffect | null)?.target
    return (target === frame || target === panel) && a.playState !== 'finished'
  })
}
