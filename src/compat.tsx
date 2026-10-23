import { Component, useId, useLayoutEffect, useRef, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { DialogFrame } from './DialogFrame'
import { openDialog } from './lifecycle'
import { store, topmost } from './store'
import type { DialogId, DialogRenderProps, Strategy } from './types'

export type ReactConfirmAlertButton = {
  label: string
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export interface ReactConfirmAlertProps {
  targetId?: string
  title?: string
  message?: string
  buttons?: Array<ReactConfirmAlertButton>
  childrenElement?: () => ReactNode
  customUI?: (customUiOptions: {
    title: string
    message: string
    buttons: Array<ReactConfirmAlertButton>
    onClose: () => void
  }) => ReactNode
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  /** @deprecated use onKeyDown with the new API */
  keyCodeForClose?: Array<number>
  willUnmount?: () => void
  afterClose?: () => void
  onClickOutside?: () => void
  onKeypressEscape?: (event: KeyboardEvent) => void
  /** @deprecated use onKeyDown with the new API */
  onkeyPress?: (event: KeyboardEvent, close: () => void) => void
  overlayClassName?: string
  /** render a native modal <dialog> in the top layer instead of the v3 overlay (default false) */
  modal?: boolean
  /** what happens to a dialog that is already open (default 'replace', as in v3) */
  strategy?: Strategy
}

export type ConfirmAlertOptions = ReactConfirmAlertProps

const defaultButtons: Array<ReactConfirmAlertButton> = [
  { label: 'Cancel', onClick: () => null },
  { label: 'Confirm', onClick: () => null }
]

interface LegacyContentProps {
  props: ReactConfirmAlertProps
  titleId: string
  close: () => void
  /** a dialog from confirmAlert only reacts to keys while it is the top one */
  id?: DialogId
}

// customUI is called inside a component with a stable type, so hooks inside it work and a new
// inline customUI on a parent re-render keeps the subtree, as calling it did in v3.
function CustomUIHost<A> ({ render, args }: { render: (args: A) => ReactNode, args: A }) {
  return <>{render(args)}</>
}

function LegacyContent ({ props, titleId, close, id }: LegacyContentProps) {
  const latest = useRef({ props, close })
  latest.current = { props, close }

  useLayoutEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (id && topmost(store.get())?.id !== id) return
      const { props, close } = latest.current
      const keyCode = event.keyCode
      if ((props.keyCodeForClose ?? []).includes(keyCode)) close()
      if ((props.closeOnEscape ?? true) && keyCode === 27) {
        props.onKeypressEscape?.(event)
        close()
      }
      props.onkeyPress?.(event, close)
    }
    document.addEventListener('keydown', keyboard, false)
    return () => document.removeEventListener('keydown', keyboard, false)
  }, [])

  const { title, message, customUI, childrenElement } = props
  const buttons = props.buttons ?? defaultButtons
  if (customUI) {
    return <CustomUIHost render={customUI} args={{ title: title as string, message: message as string, buttons, onClose: close }} />
  }
  return (
    <div className='react-confirm-alert-body' data-slot='body'>
      {title && <h1 id={titleId} data-slot='title'>{title}</h1>}
      {message}
      {childrenElement?.()}
      <div className='react-confirm-alert-button-group' data-slot='actions'>
        {buttons.map((button, i) => (
          <button
            key={i}
            className={button.className}
            {...button}
            data-slot='button'
            onClick={() => {
              if (button.onClick) (button.onClick as () => void)()
              close()
            }}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function confirmAlert (properties: ReactConfirmAlertProps): void {
  function Content ({ id, titleId, dismiss }: DialogRenderProps<void>) {
    return <LegacyContent props={properties} titleId={titleId} close={dismiss} id={id} />
  }
  openDialog<void>({
    kind: 'custom',
    title: properties.title,
    modal: properties.modal ?? false,
    closeOnClickOutside: properties.closeOnClickOutside ?? true,
    closeOnEscape: properties.closeOnEscape ?? true,
    overlayClassName: properties.overlayClassName,
    onClickOutside: properties.onClickOutside,
    legacyKeyboard: true,
    willUnmount: properties.willUnmount,
    afterClose: properties.afterClose,
    render: Content
  }, properties.targetId ?? null, properties.strategy ?? 'replace')
}

function DeclarativeDialog (props: ReactConfirmAlertProps) {
  const titleId = useId()
  const close = () => props.afterClose?.()
  return (
    <DialogFrame
      modal={props.modal ?? false}
      state='open'
      kind='custom'
      className={['react-confirm-alert-overlay', props.overlayClassName].filter(Boolean).join(' ')}
      panelClassName='react-confirm-alert'
      labelledBy={props.title ? titleId : undefined}
      closeOnClickOutside={props.closeOnClickOutside ?? true}
      closeOnEscape={props.closeOnEscape ?? true}
      legacyKeyboard
      onClickOutside={props.onClickOutside}
      onDismiss={close}
    >
      <LegacyContent props={props} titleId={titleId} close={close} />
    </DialogFrame>
  )
}

/**
 * Rendered in place, open while mounted. The parent unmounts it from a button's onClick.
 * @deprecated use <ConfirmDialog open>
 */
export default class ReactConfirmAlert extends Component<ReactConfirmAlertProps> {
  componentWillUnmount () {
    this.props.willUnmount?.()
  }

  render (): ReactElement {
    return <DeclarativeDialog {...this.props} />
  }
}
