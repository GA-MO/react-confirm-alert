import { useId } from 'react'
import { DialogFrame } from '../DialogFrame'
import { closeDialog } from '../lifecycle'
import type { Entry } from '../store'
import type { CustomOptions } from '../types'

export function CustomRenderer ({ entry }: { entry: Entry }) {
  const options = entry.options as CustomOptions<unknown>
  const titleId = useId()
  const descriptionId = useId()
  const dismiss = () => closeDialog(entry.id)
  const close = (value: unknown) => {
    entry.settle(value)
    closeDialog(entry.id)
  }
  const Render = options.render
  return (
    <DialogFrame
      id={entry.id}
      modal={options.modal ?? true}
      state={entry.phase === 'closing' ? 'closing' : 'open'}
      kind='custom'
      className={['react-confirm-alert-overlay', options.overlayClassName].filter(Boolean).join(' ')}
      panelClassName='react-confirm-alert'
      labelledBy={options.title ? titleId : undefined}
      closeOnClickOutside={options.closeOnClickOutside ?? true}
      closeOnEscape={options.closeOnEscape ?? true}
      legacyKeyboard={options.legacyKeyboard ?? false}
      onClickOutside={options.onClickOutside}
      onDismiss={dismiss}
    >
      <Render
        id={entry.id}
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
