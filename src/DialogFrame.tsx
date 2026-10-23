import { useLayoutEffect, useRef, type ReactNode, type SyntheticEvent } from 'react'
import { registerFrame } from './lifecycle'
import type { DialogId, DialogKind } from './types'

export interface DialogFrameProps {
  id?: DialogId
  modal: boolean
  state: 'open' | 'closing'
  kind: DialogKind
  className: string
  panelClassName: string
  labelledBy?: string | undefined
  closeOnClickOutside: boolean
  closeOnEscape: boolean
  /** the v3 API reads Escape from document keydown, so the native cancel only gets blocked */
  legacyKeyboard: boolean
  onClickOutside?: (() => void) | undefined
  onDismiss: () => void
  children: ReactNode
}

const canShowModal = () =>
  typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal === 'function'

export function DialogFrame (props: DialogFrameProps) {
  const frame = useRef<HTMLElement | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)
  const pressedOn = useRef<EventTarget | null>(null)
  const native = props.modal && canShowModal()

  useLayoutEffect(() => {
    const element = frame.current!
    const previous = document.activeElement
    if (props.id) registerFrame(props.id, element, panel.current)
    if (native) {
      const dialog = element as HTMLDialogElement
      if (!dialog.open) dialog.showModal()
    }
    panel.current?.focus({ preventScroll: true })
    return () => {
      if (props.id) registerFrame(props.id, null, null)
      const dialog = element as HTMLDialogElement
      if (native && dialog.open) dialog.close()
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])

  const onPointerDown = (e: SyntheticEvent) => { pressedOn.current = e.target }

  // Outside means both the press and the click landed on the frame itself, so a drag that starts
  // inside the panel and ends on the overlay keeps the dialog open (#92).
  const onClick = (e: SyntheticEvent) => {
    const pressed = pressedOn.current
    pressedOn.current = null
    const outside = e.target === frame.current && (pressed === null || pressed === frame.current)
    if (props.closeOnClickOutside && outside) {
      props.onClickOutside?.()
      props.onDismiss()
    }
    e.stopPropagation()
  }

  const onCancel = (e: SyntheticEvent) => {
    e.preventDefault()
    if (!props.legacyKeyboard && props.closeOnEscape) props.onDismiss()
  }

  // Some browsers close a modal dialog on a repeated Escape even when cancel was prevented.
  const onClose = () => {
    if (props.state === 'open') props.onDismiss()
  }

  const shared = {
    className: props.className,
    'aria-labelledby': props.labelledBy,
    'data-rca': '',
    'data-state': props.state,
    'data-kind': props.kind,
    'data-slot': 'dialog',
    onPointerDown,
    onClick
  }
  const content = (
    <div ref={panel} className={props.panelClassName} data-slot='panel' tabIndex={-1}>
      {props.children}
    </div>
  )

  return native
    ? <dialog ref={(el) => { frame.current = el }} {...shared} onCancel={onCancel} onClose={onClose}>{content}</dialog>
    : <div ref={(el) => { frame.current = el }} role='dialog' {...shared}>{content}</div>
}
