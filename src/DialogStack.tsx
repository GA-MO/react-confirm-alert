import { useLayoutEffect, useSyncExternalStore, type ComponentType } from 'react'
import { CustomRenderer } from './renderers/custom'
import { store, type Entry } from './store'
import type { DialogKind } from './types'

const renderers = { custom: CustomRenderer } satisfies Record<DialogKind, ComponentType<{ entry: Entry }>>

export function DialogStack ({ target }: { target: string | null }) {
  const state = useSyncExternalStore(store.subscribe, store.get, store.get)
  return (
    <>
      {state.entries
        .filter((e) => e.target === target && e.phase !== 'queued')
        .map((e) => <EntryView key={e.id} entry={e} />)}
    </>
  )
}

function EntryView ({ entry }: { entry: Entry }) {
  // willUnmount and afterClose run here, in that order, when the entry has left the store. A
  // StrictMode remount keeps the entry, so it does not count as a close.
  useLayoutEffect(() => () => {
    if (store.get().entries.some((e) => e.id === entry.id)) return
    entry.options.willUnmount?.()
    entry.options.afterClose?.()
    entry.settle(undefined)
  }, [])
  const Renderer = renderers[entry.options.kind]
  return <Renderer entry={entry} />
}
