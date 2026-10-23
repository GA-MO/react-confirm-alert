import type { ButtonHTMLAttributes, ComponentType, InputHTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react'

export type DialogId = string & { readonly __brand: 'DialogId' }

// replace closes whatever is open first (confirmAlert's default), stack opens on top, queue waits.
export type Strategy = 'stack' | 'queue' | 'replace'

export interface ButtonContext<R> {
  close: (value: R) => void
  dismiss: () => void
  /** aborted when the dialog closes from elsewhere while this button waits */
  signal: AbortSignal
}

export interface DialogButton<R> extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'value' | 'children'> {
  label: ReactNode
  value?: R | undefined
  variant?: 'primary' | 'secondary' | 'danger' | undefined
  /** return false to stay open; return a Promise to show the button as busy until it settles */
  onClick?: ((ctx: ButtonContext<R>) => void | false | Promise<void | false>) | undefined
}

export interface DialogRenderProps<R> {
  id: DialogId
  titleId: string
  descriptionId: string
  title?: ReactNode | undefined
  message?: ReactNode | undefined
  content?: ReactNode | undefined
  buttons: readonly DialogButton<R>[]
  close: (value: R) => void
  dismiss: () => void
  /** alias of dismiss, so v3 customUI code keeps working */
  onClose: () => void
}

export type DialogSlot =
  | 'dialog' | 'panel' | 'body' | 'title' | 'message' | 'actions' | 'button' | 'field' | 'label' | 'input' | 'error'

export type DialogClassNames = Partial<Record<DialogSlot, string>>

export interface StyleOptions {
  /** leave out the v3 class names; only classNames, data attributes and ARIA remain */
  unstyled?: boolean | undefined
  /** added to each slot's classes, after the app defaults */
  classNames?: DialogClassNames | undefined
}

export interface DialogDefaults extends StyleOptions {
  closeOnEscape?: boolean | undefined
  closeOnClickOutside?: boolean | undefined
  strategy?: Strategy | undefined
  modal?: boolean | undefined
  /** default true: body gets react-confirm-alert-body-element while a dialog is open */
  lockScroll?: boolean | undefined
  labels?: { ok?: ReactNode, confirm?: ReactNode, cancel?: ReactNode, submit?: ReactNode } | undefined
  /** separate defaults for confirmAlert, which otherwise keeps v3 behavior */
  confirmAlert?: (StyleOptions & { modal?: boolean | undefined, strategy?: Strategy | undefined, skin?: boolean | undefined }) | undefined
}

/** Attributes on the frame, for CSS and Tailwind data-* variants. A type only, kept in step by tests. */
export interface DialogDataAttributes {
  'data-rca': ''
  'data-state': 'open' | 'closing'
  'data-kind': DialogKind
  'data-tone': 'default' | 'danger'
  'data-busy'?: ''
  'data-depth': `${number}`
  'data-topmost'?: ''
}

export interface SlotDataAttributes {
  'data-slot': DialogSlot
}

export interface ButtonDataAttributes extends SlotDataAttributes {
  'data-variant': 'primary' | 'secondary' | 'danger'
  'data-busy'?: ''
}

export interface BaseOptions extends StyleOptions {
  title?: ReactNode | undefined
  message?: ReactNode | undefined
  /** your own content between the message and the buttons */
  content?: ReactNode | undefined
  closeOnEscape?: boolean | undefined
  closeOnClickOutside?: boolean | undefined
  strategy?: Strategy | undefined
  modal?: boolean | undefined
  signal?: AbortSignal | undefined
  onKeyDown?: ((event: KeyboardEvent<HTMLElement>, close: () => void) => void) | undefined
  afterClose?: (() => void) | undefined
}

export interface AlertOptions extends BaseOptions {
  kind: 'alert'
  okLabel?: ReactNode | undefined
}

export interface ConfirmOptions extends BaseOptions {
  kind: 'confirm'
  confirmLabel?: ReactNode | undefined
  cancelLabel?: ReactNode | undefined
  /** danger moves the initial focus to the cancel button */
  tone?: 'default' | 'danger' | undefined
  onConfirm?: ((ctx: { signal: AbortSignal }) => void | Promise<void>) | undefined
}

export interface PromptOptions extends BaseOptions {
  kind: 'prompt'
  label?: ReactNode | undefined
  defaultValue?: string | undefined
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> | undefined
  /** return a message to keep the dialog open and show it under the input */
  validate?: ((value: string) => string | null | Promise<string | null>) | undefined
  submitLabel?: ReactNode | undefined
  cancelLabel?: ReactNode | undefined
}

export interface CustomOptions<R> extends BaseOptions {
  kind: 'custom'
  render: ComponentType<DialogRenderProps<R>>
  buttons?: readonly DialogButton<R>[] | undefined
}

export type DialogKind = 'alert' | 'confirm' | 'prompt' | 'custom'

/** what the store keeps: every kind renders through `render` */
export interface EntryOptions extends BaseOptions {
  kind: DialogKind
  render: ComponentType<DialogRenderProps<any>>
  buttons?: readonly DialogButton<any>[] | undefined
  /** @internal class names from the v3 API, added to the frame */
  overlayClassName?: string | undefined
  /** @internal v3 callback for a click on the overlay */
  onClickOutside?: (() => void) | undefined
  /** @internal the v3 API: Escape from document keydown, blur on body.children[0] */
  legacy?: boolean | undefined
  /** @internal confirmAlert opted into the new default look */
  skin?: boolean | undefined
  /** @internal confirm's tone, shown as data-tone on the frame */
  tone?: 'default' | 'danger' | undefined
  /** @internal v3 callback, runs before afterClose when the dialog unmounts */
  willUnmount?: (() => void) | undefined
}

export interface DialogHandle<R> {
  readonly id: DialogId
  readonly result: Promise<R | undefined>
  close: (value: R) => void
  dismiss: () => void
  update: (patch: Partial<Omit<CustomOptions<R>, 'kind'>>) => void
}

export interface DialogAction extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'> {
  label: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | undefined
  /** return a Promise to show the button as busy until it settles; the dialog stays open */
  onClick?: ((event: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>) | undefined
}

export interface DialogLayoutProps {
  title?: ReactNode | undefined
  message?: ReactNode | undefined
  actions?: readonly DialogAction[] | undefined
  children?: ReactNode | undefined
}
