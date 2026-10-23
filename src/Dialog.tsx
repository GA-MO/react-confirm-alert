import { useId, useLayoutEffect, useRef, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react'
import { Body, Buttons, PromptBody } from './api'
import { DialogFrame } from './DialogFrame'
import { syncPage } from './page'
import { runtime } from './store'
import type { AlertOptions, ConfirmOptions, DialogButton, DialogId, DialogRenderProps, PromptOptions } from './types'

interface InPlace {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface DialogProps extends InPlace {
  children: ReactNode
  modal?: boolean | undefined
  closeOnEscape?: boolean | undefined
  closeOnClickOutside?: boolean | undefined
  onKeyDown?: ((event: KeyboardEvent<HTMLElement>, close: () => void) => void) | undefined
  className?: string | undefined
  'aria-label'?: string | undefined
  'aria-labelledby'?: string | undefined
  'aria-describedby'?: string | undefined
}

type Declarative<O> = InPlace & Omit<O, 'signal' | 'strategy'>
export type ConfirmDialogProps =
  | Declarative<AlertOptions>
  | Declarative<ConfirmOptions>
  | (Declarative<PromptOptions> & { onSubmit: (value: string) => void | Promise<void> })

const subscribeNever = () => () => {}

// Renders nothing on the server and during hydration: a modal needs JavaScript anyway, and this way
// class names set on the client cannot cause a mismatch.
function useHydrated () {
  return useSyncExternalStore(subscribeNever, () => true, () => false)
}

function useScrollLock (open: boolean) {
  useLayoutEffect(() => {
    if (!open) return
    runtime().inPlace++
    syncPage()
    return () => {
      runtime().inPlace--
      syncPage()
    }
  }, [open])
}

/** A dialog rendered where it is placed, so its children read the latest state of the component (#63 #66). */
export function Dialog (props: DialogProps) {
  const id = useId() as DialogId
  const hydrated = useHydrated()
  useScrollLock(props.open && hydrated)
  if (!hydrated || !props.open) return null
  return (
    <DialogFrame
      id={id}
      modal={props.modal ?? true}
      state='open'
      kind='custom'
      className={props.className ?? 'react-confirm-alert-overlay'}
      panelClassName='react-confirm-alert'
      label={props['aria-label']}
      labelledBy={props['aria-labelledby']}
      describedBy={props['aria-describedby']}
      role='dialog'
      closeOnClickOutside={props.closeOnClickOutside ?? true}
      closeOnEscape={props.closeOnEscape ?? true}
      legacy={false}
      onKeyDown={props.onKeyDown}
      onDismiss={() => props.onOpenChange(false)}
    >
      {props.children}
    </DialogFrame>
  )
}

/** confirm, alert or prompt rendered in place and driven by `open`. */
export function ConfirmDialog (props: ConfirmDialogProps) {
  const id = useId() as DialogId
  const titleId = useId()
  const descriptionId = useId()
  const hydrated = useHydrated()
  // A fresh signal per opening, aborted when the dialog closes while a button waits. Made in the
  // effect, so StrictMode's extra cleanup aborts a controller that the second run replaces.
  const controller = useRef<AbortController>(new AbortController())
  useLayoutEffect(() => {
    if (!props.open) return
    const current = new AbortController()
    controller.current = current
    return () => current.abort()
  }, [props.open])
  useScrollLock(props.open && hydrated)
  if (!hydrated || !props.open) return null

  const hide = () => props.onOpenChange(false)
  const base: Omit<DialogRenderProps<any>, 'close' | 'buttons'> = {
    id, titleId, descriptionId, title: props.title, message: props.message, dismiss: hide, onClose: hide
  }
  let body: ReactNode
  if (props.kind === 'prompt') {
    const { onSubmit } = props
    const close = async (value: string) => {
      try {
        await onSubmit(value)
        hide()
      } catch (error) {
        console.error(error)
      }
    }
    body = <PromptBody props={{ ...base, buttons: [], close: (v: string) => { void close(v) } }} options={props} />
  } else {
    const danger = props.kind === 'confirm' && props.tone === 'danger'
    const buttons: DialogButton<boolean>[] = props.kind === 'alert'
      ? [{ label: props.okLabel ?? 'OK', variant: 'primary' }]
      : [
          { label: props.cancelLabel ?? 'Cancel', value: false },
          { label: props.confirmLabel ?? 'Confirm', value: true, variant: danger ? 'danger' : 'primary', onClick: props.onConfirm && ((ctx) => props.onConfirm!({ signal: ctx.signal })) }
        ]
    const renderProps = { ...base, buttons, close: hide }
    body = <Body props={renderProps}><Buttons props={renderProps} signal={() => controller.current.signal} focus={props.kind === 'alert' || danger ? 0 : 1} /></Body>
  }
  return (
    <DialogFrame
      id={id}
      modal={props.modal ?? true}
      state='open'
      kind={props.kind}
      className='react-confirm-alert-overlay'
      panelClassName='react-confirm-alert'
      labelledBy={props.title ? titleId : undefined}
      describedBy={props.message ? descriptionId : undefined}
      role={props.kind === 'prompt' ? 'dialog' : 'alertdialog'}
      closeOnClickOutside={props.closeOnClickOutside ?? true}
      closeOnEscape={props.closeOnEscape ?? true}
      legacy={false}
      onKeyDown={props.onKeyDown}
      onDismiss={hide}
    >
      {body}
    </DialogFrame>
  )
}
