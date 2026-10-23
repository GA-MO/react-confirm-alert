import type { ComponentType, ReactNode } from 'react'

export type DialogId = string & { readonly __brand: 'DialogId' }

// replace closes whatever is open first (confirmAlert's default), stack opens on top, queue waits.
export type Strategy = 'stack' | 'queue' | 'replace'

export interface DialogRenderProps<R> {
  id: DialogId
  titleId: string
  descriptionId: string
  title?: ReactNode | undefined
  message?: ReactNode | undefined
  close: (value: R) => void
  dismiss: () => void
  onClose: () => void
}

export interface BaseOptions {
  title?: ReactNode | undefined
  message?: ReactNode | undefined
  closeOnEscape?: boolean | undefined
  closeOnClickOutside?: boolean | undefined
  strategy?: Strategy | undefined
  modal?: boolean | undefined
  afterClose?: (() => void) | undefined
}

export interface CustomOptions<R> extends BaseOptions {
  kind: 'custom'
  render: ComponentType<DialogRenderProps<R>>
  /** @internal class names from the v3 API, added to the frame */
  overlayClassName?: string | undefined
  /** @internal v3 callback for a click on the overlay */
  onClickOutside?: (() => void) | undefined
  /** @internal the v3 API handles Escape itself on document keydown */
  legacyKeyboard?: boolean | undefined
  /** @internal v3 callback, runs before afterClose when the dialog unmounts */
  willUnmount?: (() => void) | undefined
}

export type DialogOptions<R> = CustomOptions<R>

export type DialogKind = DialogOptions<unknown>['kind']
