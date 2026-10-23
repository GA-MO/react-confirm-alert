import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode, type SyntheticEvent, type ReactElement } from 'react'
import { registerFrame, reopenClosedFrames } from './lifecycle'
import { runtime, store, topmost } from './store'
import type { DialogId, DialogKind, StyleOptions } from './types'
import { SlotContext, slotsFor } from './classNames'

export interface DialogFrameProps {
  id?: DialogId
  modal: boolean
  state: 'open' | 'closing'
  kind: DialogKind
  /** style layers, widest first (see classNames.ts) */
  layers: readonly StyleOptions[]
  /** v3 overlayClassName, added to the dialog slot */
  extraClass?: string | undefined
  tone?: 'default' | 'danger' | undefined
  depth?: number | undefined
  topmost?: boolean | undefined
  label?: string | undefined
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

export function DialogFrame (props: DialogFrameProps): ReactElement {
  const frame = useRef<HTMLElement | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)
  const pressedOn = useRef<EventTarget | null>(null)
  const stay = useRef<boolean | null>(null)
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

  // In-place dialogs are not in the store and count as the top one.
  const isTop = () => !props.id || !store.get().entries.some((e) => e.id === props.id) || topmost(store.get())?.id === props.id
  // Decided at cancel time: once the top dialog starts closing, the next one would look like the top.
  const mustStay = () => !isTop() || !props.closeOnEscape || isBusy()

  const onCancel = (e: SyntheticEvent) => {
    e.preventDefault()
    stay.current = mustStay()
    if (!stay.current && !props.legacy) props.onDismiss()
  }

  // The browser closed the dialog itself: a repeated Escape, or a group of dialogs opened from code.
  const onClose = (e: SyntheticEvent) => {
    const dialog = e.currentTarget as HTMLDialogElement
    // StrictMode closes and reopens the dialog on mount; the late close event finds it open again.
    if (dialog.open) return
    const keep = stay.current ?? mustStay()
    stay.current = null
    if (props.state !== 'open') return
    if (!keep) props.onDismiss()
    else if (props.id && store.get().entries.some((x) => x.id === props.id)) reopenClosedFrames()
    else dialog.showModal()
  }

  const isBusy = () => !!props.id && runtime().busy.has(props.id)

  // A native modal reports Escape as cancel. Without showModal the frame reads the key itself.
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    // Closing from a key stops the key: Enter would otherwise click the opener that gets focus back (#84).
    props.onKeyDown?.(e, () => {
      e.preventDefault()
      props.onDismiss()
    })
    if (!native && !props.legacy && e.key === 'Escape' && props.closeOnEscape && !isBusy()) props.onDismiss()
  }

  // Some browsers close a modal dialog on a repeated Escape even when cancel was prevented.
  const slot = slotsFor(props.layers)
  const shared = {
    ...slot('dialog', props.extraClass),
    role: props.role,
    'aria-label': props.label,
    'aria-labelledby': props.labelledBy,
    'aria-describedby': props.describedBy,
    'data-rca': '',
    'data-state': props.state,
    'data-kind': props.kind,
    // Every dialog but confirmAlert gets the new default look; confirmAlert keeps the 3.0 one.
    'data-skin': props.legacy ? undefined : '',
    'data-tone': props.tone ?? 'default',
    'data-depth': String(props.depth ?? 0),
    'data-topmost': props.topmost ?? true ? '' : undefined,
    onPointerDown,
    onClick,
    onKeyDown
  }
  const content = (
    <div ref={panel} {...slot('panel')} tabIndex={-1}>
      <SlotContext.Provider value={slot}>{props.children}</SlotContext.Provider>
    </div>
  )

  return native
    ? <dialog ref={(el) => { frame.current = el }} {...shared} onCancel={onCancel} onClose={onClose}>{content}</dialog>
    : <div ref={(el) => { frame.current = el }} {...shared}>{content}</div>
}
