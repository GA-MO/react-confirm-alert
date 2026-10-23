import { type ReactElement, useId, useLayoutEffect, useReducer, useSyncExternalStore } from 'react'
import { DialogFrame } from './DialogFrame'
import { closeDialog } from './lifecycle'
import { emptyState, runtime, store, type Entry } from './store'
import { styleLayers } from './classNames'

const serverState = () => emptyState

export function DialogStack ({ target, host }: { target: string | null, host?: symbol }): ReactElement | null {
  const { entries, hosts } = useSyncExternalStore(store.subscribe, store.get, serverState)
  // useSyncExternalStore subscribes in a passive effect, which a slow device can run after the dialog
  // is already on screen. A close clicked before that would not re-render in the same click, breaking
  // v3's synchronous close. A layout-effect subscription exists from the commit that shows the dialog.
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  useLayoutEffect(() => store.subscribe(rerender), [])
  // The default container yields to the last mounted DialogHost; a host only renders while it is last.
  const active = host ? hosts[hosts.length - 1] === host : target !== null || hosts.length === 0
  if (!active) return null
  // Depth and topmost count open dialogs across every container, not only this one.
  const openIds = entries.filter((e) => e.phase === 'open').map((e) => e.id)
  const top = openIds[openIds.length - 1]
  return (
    <>
      {entries
        .filter((e) => e.target === target && e.phase !== 'queued')
        .map((e) => <EntryView key={e.id} entry={e} depth={openIds.indexOf(e.id)} topmost={e.id === top} />)}
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
      skin={options.skin}
      onClickOutside={options.onClickOutside}
      onDismiss={dismiss}
    >
      <Render
        id={id}
        titleId={titleId}
        descriptionId={descriptionId}
        title={options.title}
        message={options.message}
        content={options.content}
        buttons={options.buttons ?? []}
        close={close}
        dismiss={dismiss}
        onClose={dismiss}
      />
    </DialogFrame>
  )
}
