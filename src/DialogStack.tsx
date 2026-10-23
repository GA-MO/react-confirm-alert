import { useId, useLayoutEffect, useSyncExternalStore } from 'react'
import { DialogFrame } from './DialogFrame'
import { closeDialog } from './lifecycle'
import { emptyState, store, type Entry } from './store'

const serverState = () => emptyState

export function DialogStack ({ target, host }: { target: string | null, host?: symbol }) {
  const { entries, hosts } = useSyncExternalStore(store.subscribe, store.get, serverState)
  // The default container yields to the last mounted DialogHost; a host only renders while it is last.
  const active = host ? hosts[hosts.length - 1] === host : target !== null || hosts.length === 0
  if (!active) return null
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
      describedBy={options.message ? descriptionId : undefined}
      role={options.kind === 'alert' || options.kind === 'confirm' ? 'alertdialog' : 'dialog'}
      onKeyDown={options.onKeyDown}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      legacy={!!options.legacy}
      onClickOutside={options.onClickOutside}
      onDismiss={dismiss}
    >
      <Render
        id={id}
        titleId={titleId}
        descriptionId={descriptionId}
        title={options.title}
        message={options.message}
        buttons={options.buttons ?? []}
        close={close}
        dismiss={dismiss}
        onClose={dismiss}
      />
    </DialogFrame>
  )
}
