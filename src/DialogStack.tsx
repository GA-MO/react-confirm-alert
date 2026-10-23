import { useId, useLayoutEffect, useSyncExternalStore } from 'react'
import { DialogFrame } from './DialogFrame'
import { closeDialog } from './lifecycle'
import { store, type Entry } from './store'

export function DialogStack ({ target }: { target: string | null }) {
  const { entries } = useSyncExternalStore(store.subscribe, store.get, store.get)
  return (
    <>
      {entries
        .filter((e) => e.target === target && e.phase !== 'queued')
        .map((e) => <EntryView key={e.id} entry={e} />)}
    </>
  )
}

// Every kind renders through the same frame. A kind only differs in its render component, which the
// API that opens it supplies, so importing confirmAlert never bundles the confirm or prompt bodies.
function EntryView ({ entry }: { entry: Entry }) {
  const { id, options } = entry
  const titleId = useId()
  const descriptionId = useId()

  // willUnmount and afterClose run here, in that order, once the entry has left the store. A
  // StrictMode remount keeps the entry, so it does not count as a close.
  useLayoutEffect(() => () => {
    if (store.get().entries.some((e) => e.id === id)) return
    options.willUnmount?.()
    options.afterClose?.()
    entry.settle(undefined)
  }, [])

  const dismiss = () => closeDialog(id)
  const close = (value: unknown) => {
    entry.settle(value)
    closeDialog(id)
  }
  const { render: Render, modal = true, closeOnClickOutside = true, closeOnEscape = true } = options
  return (
    <DialogFrame
      id={id}
      modal={modal}
      state={entry.phase === 'closing' ? 'closing' : 'open'}
      kind={options.kind}
      className={options.overlayClassName ? `react-confirm-alert-overlay ${options.overlayClassName}` : 'react-confirm-alert-overlay'}
      panelClassName='react-confirm-alert'
      labelledBy={options.title ? titleId : undefined}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      legacyKeyboard={!!options.legacyKeyboard}
      onClickOutside={options.onClickOutside}
      onDismiss={dismiss}
    >
      <Render
        id={id}
        titleId={titleId}
        descriptionId={descriptionId}
        title={options.title}
        message={options.message}
        close={close}
        dismiss={dismiss}
        onClose={dismiss}
      />
    </DialogFrame>
  )
}
