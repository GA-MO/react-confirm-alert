import { flushSync } from 'react-dom'
import { beginClose, push, remove, runtime, store, type Entry } from './store'
import type { DialogId, DialogOptions } from './types'
import { ensureContainer } from './fallbackRoot'

type Mounted = { frame: HTMLElement, panel: HTMLElement | null }

export function registerFrame (id: DialogId, frame: HTMLElement | null, panel: HTMLElement | null) {
  if (frame) runtime().frames.set(id, { frame, panel })
  else runtime().frames.delete(id)
}

export function openDialog<R> (options: DialogOptions<R>, target: string | null, strategy = options.strategy ?? 'stack') {
  const id = store.nextId()
  const resolved = ensureContainer(target)
  const entry: Omit<Entry, 'phase'> = { id, options, target: resolved.target, blur: resolved.blur, settle: () => {} }
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

// Only animations on the frame, its ::backdrop and the panel count. Children can run endless
// animations (a spinner) that would keep the dialog open forever.
function animationsOf ({ frame, panel }: Mounted): Animation[] {
  if (typeof frame.getAnimations !== 'function') return []
  return frame.getAnimations({ subtree: true }).filter((a) => {
    const target = (a.effect as KeyframeEffect | null)?.target
    return (target === frame || target === panel) && a.playState !== 'finished'
  })
}
