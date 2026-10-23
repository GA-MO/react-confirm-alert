import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode, type SyntheticEvent } from 'react'
import { registerFrame } from './lifecycle'
import { runtime } from './store'
import type { DialogId, DialogKind } from './types'

export interface DialogFrameProps {
  id?: DialogId
  modal: boolean
  state: 'open' | 'closing'
  kind: DialogKind
  className: string
  panelClassName: string
  labelledBy?: string | undefined
  describedBy?: string | undefined
  role: 'dialog' | 'alertdialog'
  closeOnClickOutside: boolean
  closeOnEscape: boolean
  /** the v3 API reads Escape from document keydown and focuses the panel */
  legacy: boolean
  onKeyDown?: ((event: KeyboardEvent<HTMLElement>, close: () => void) => void) | undefined
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
    // The v3 API focuses the panel, so Enter cannot press a button by accident (B14). The new API
    // focuses the element its body marks, or keeps what showModal chose.
    const marked = panel.current?.querySelector<HTMLElement>('[data-autofocus]')
    const inside = panel.current?.contains(document.activeElement)
    if (props.legacy || (!marked && !inside)) panel.current?.focus({ preventScroll: true })
    else if (marked) marked.focus({ preventScroll: true })
    return () => {
      if (props.id) registerFrame(props.id, null, null)
      const dialog = element as HTMLDialogElement
      if (native && dialog.open) dialog.close()
      // After the whole batch of closes commits, so an element under another closing modal is no longer inert.
      queueMicrotask(() => {
        if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true })
      })
    }
  }, [])

  const onPointerDown = (e: SyntheticEvent) => { pressedOn.current = e.target }

  // Outside means both the press and the click landed on the frame itself, so a drag that starts
  // inside the panel and ends on the overlay keeps the dialog open (#92).
  const onClick = (e: SyntheticEvent) => {
    const pressed = pressedOn.current
    pressedOn.current = null
    const outside = e.target === frame.current && (pressed === null || pressed === frame.current)
    if (props.closeOnClickOutside && outside && !isBusy()) {
      props.onClickOutside?.()
      props.onDismiss()
    }
    e.stopPropagation()
  }

  const onCancel = (e: SyntheticEvent) => {
    e.preventDefault()
    if (!props.legacy && props.closeOnEscape && !isBusy()) props.onDismiss()
  }

  const isBusy = () => !!props.id && runtime().busy.has(props.id)

  // A native modal reports Escape as cancel. Without showModal the frame reads the key itself.
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    props.onKeyDown?.(e, props.onDismiss)
    if (!native && !props.legacy && e.key === 'Escape' && props.closeOnEscape && !isBusy()) props.onDismiss()
  }

  // Some browsers close a modal dialog on a repeated Escape even when cancel was prevented.
  // Escape is blocked by closeOnEscape: false or a busy button, so the dialog opens again.
  const onClose = () => {
    if (props.state !== 'open') return
    const blocked = !props.closeOnEscape || isBusy()
    if (blocked) (frame.current as HTMLDialogElement).showModal()
    else props.onDismiss()
  }

  const shared = {
    className: props.className,
    role: props.role,
    'aria-labelledby': props.labelledBy,
    'aria-describedby': props.describedBy,
    'data-rca': '',
    'data-state': props.state,
    'data-kind': props.kind,
    'data-slot': 'dialog',
    onPointerDown,
    onClick,
    onKeyDown
  }
  const content = (
    <div ref={panel} className={props.panelClassName} data-slot='panel' tabIndex={-1}>
      {props.children}
    </div>
  )

  return native
    ? <dialog ref={(el) => { frame.current = el }} {...shared} onCancel={onCancel} onClose={onClose}>{content}</dialog>
    : <div ref={(el) => { frame.current = el }} {...shared}>{content}</div>
}
