import { useId, useLayoutEffect, useSyncExternalStore, type ReactElement } from 'react'
import { DialogFrame } from './DialogFrame'
import { closeDialog } from './lifecycle'
import { emptyState, runtime, store, type Entry } from './store'
import { styleLayers } from './classNames'

const serverState = () => emptyState

export function DialogStack ({ target, host }: { target: string | null, host?: symbol }): ReactElement | null {
  const { entries, hosts } = useSyncExternalStore(store.subscribe, store.get, serverState)
  // The default container yields to the last mounted DialogHost; a host only renders while it is last.
  const active = host ? hosts[hosts.length - 1] === host : target !== null || hosts.length === 0
  if (!active) return null
  return (
    <>
      {entries
        .filter((e) => e.target === target && e.phase !== 'queued')
        .map((e, i, visible) => <EntryView key={e.id} entry={e} depth={i} topmost={i === visible.length - 1} />)}
    </>
  )
}

// Every kind renders through the same frame. A kind only differs in its render component, which the
// API that opens it supplies, so importing confirmAlert never bundles the confirm or prompt bodies.
function EntryView ({ entry, depth, topmost }: { entry: Entry, depth: number, topmost: boolean }) {
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
  const defaults = runtime().defaults
  const { render: Render } = options
  return (
    <DialogFrame
      id={id}
      modal={options.modal ?? defaults.modal ?? true}
      state={entry.phase === 'closing' ? 'closing' : 'open'}
      kind={options.kind}
      layers={styleLayers(options, !!options.legacy)}
      extraClass={options.overlayClassName}
      tone={options.tone}
      depth={depth}
      topmost={topmost}
      labelledBy={options.title ? titleId : undefined}
      describedBy={options.message ? descriptionId : undefined}
      role={options.kind === 'alert' || options.kind === 'confirm' ? 'alertdialog' : 'dialog'}
      onKeyDown={options.onKeyDown}
      closeOnClickOutside={options.closeOnClickOutside ?? defaults.closeOnClickOutside ?? true}
      closeOnEscape={options.closeOnEscape ?? defaults.closeOnEscape ?? true}
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
