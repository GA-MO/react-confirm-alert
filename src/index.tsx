import { Component, type ButtonHTMLAttributes, type MouseEvent as ReactMouseEvent, type ReactElement, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'

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
  keyCodeForClose?: Array<number>
  willUnmount?: () => void
  afterClose?: () => void
  onClickOutside?: () => void
  onKeypressEscape?: (event: KeyboardEvent) => void
  onkeyPress?: () => void
  overlayClassName?: string
}

type Props = ReactConfirmAlertProps & Required<Pick<ReactConfirmAlertProps,
  | 'buttons'
  | 'childrenElement'
  | 'closeOnClickOutside'
  | 'closeOnEscape'
  | 'keyCodeForClose'
  | 'willUnmount'
  | 'afterClose'
  | 'onClickOutside'
  | 'onKeypressEscape'
>>

export default class ReactConfirmAlert extends Component<ReactConfirmAlertProps> {
  static defaultProps = {
    buttons: [
      {
        label: 'Cancel',
        onClick: () => null,
        className: null
      },
      {
        label: 'Confirm',
        onClick: () => null,
        className: null
      }
    ],
    childrenElement: () => null,
    closeOnClickOutside: true,
    closeOnEscape: true,
    keyCodeForClose: [],
    willUnmount: () => null,
    afterClose: () => null,
    onClickOutside: () => null,
    onKeypressEscape: () => null
  }

  declare props: Props

  overlay: HTMLDivElement | null = null

  handleClickButton = (button: ReactConfirmAlertButton) => {
    if (button.onClick) (button.onClick as () => void)()
    this.close()
  }

  handleClickOverlay = (e: ReactMouseEvent<HTMLDivElement>) => {
    const { closeOnClickOutside, onClickOutside } = this.props
    const isClickOutside = e.target === this.overlay

    if (closeOnClickOutside && isClickOutside) {
      onClickOutside()
      this.close()
    }

    e.stopPropagation()
  }

  close = () => {
    const { afterClose } = this.props
    removeBodyClass()
    removeElementReconfirm(this.props)
    removeSVGBlurReconfirm(afterClose)
  }

  keyboard = (event: KeyboardEvent) => {
    const { closeOnEscape, onKeypressEscape, onkeyPress, keyCodeForClose } = this.props
    const keyCode = event.keyCode
    const isKeyCodeEscape = keyCode === 27

    if (keyCodeForClose.includes(keyCode)) {
      this.close()
    }

    if (closeOnEscape && isKeyCodeEscape) {
      onKeypressEscape(event)
      this.close()
    }

    if (onkeyPress) {
      onkeyPress()
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.keyboard, false)
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.keyboard, false)
    this.props.willUnmount()
  }

  renderCustomUI = () => {
    const { title, message, buttons, customUI } = this.props
    const dataCustomUI = {
      title: title as string,
      message: message as string,
      buttons,
      onClose: this.close
    }

    return customUI!(dataCustomUI)
  }

  render (): ReactElement {
    const { title, message, buttons, childrenElement, customUI, overlayClassName } = this.props

    return (
      <div
        className={`react-confirm-alert-overlay ${overlayClassName}`}
        ref={dom => { this.overlay = dom }}
        onClick={this.handleClickOverlay}
      >
        <div className='react-confirm-alert'>
          {customUI ? (
            this.renderCustomUI()
          ) : (
            <div className='react-confirm-alert-body'>
              {title && <h1>{title}</h1>}
              {message}
              {childrenElement()}
              <div className='react-confirm-alert-button-group'>
                {buttons.map((button, i) => (
                  <button
                    key={i}
                    className={button.className}
                    {...button}
                    onClick={() => this.handleClickButton(button)}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

let root: Root | null = null
const targetId = 'react-confirm-alert'

function createSVGBlurReconfirm () {
  // If has svg ignore to create the svg
  const svg = document.getElementById('react-confirm-alert-firm-svg')
  if (svg) return
  const svgNS = 'http://www.w3.org/2000/svg'
  const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur')
  feGaussianBlur.setAttribute('stdDeviation', '0.3')

  const filter = document.createElementNS(svgNS, 'filter')
  filter.setAttribute('id', 'gaussian-blur')
  filter.appendChild(feGaussianBlur)

  const svgElem = document.createElementNS(svgNS, 'svg')
  svgElem.setAttribute('id', 'react-confirm-alert-firm-svg')
  svgElem.setAttribute('class', 'react-confirm-alert-svg')
  svgElem.appendChild(filter)

  document.body.appendChild(svgElem)
}

function removeSVGBlurReconfirm (afterClose: () => void) {
  const svg = document.getElementById('react-confirm-alert-firm-svg')
  if (svg) {
    svg.parentNode!.removeChild(svg)
  }
  document.body.children[0]!.classList.remove('react-confirm-alert-blur')
  afterClose()
}

function createElementReconfirm (properties: ReactConfirmAlertProps) {
  let divTarget = document.getElementById(properties.targetId || targetId)

  if (properties.targetId && !divTarget) {
    console.error('React Confirm Alert:', `Can not get element id (#${properties.targetId})`)
  }

  if (divTarget) {
    root = createRoot(divTarget)
    root.render(<ReactConfirmAlert {...properties} />)
  } else {
    document.body.children[0]!.classList.add('react-confirm-alert-blur')
    divTarget = document.createElement('div')
    divTarget.id = targetId
    document.body.appendChild(divTarget)
    root = createRoot(divTarget)
    root.render(<ReactConfirmAlert {...properties} />)
  }
}

function removeElementReconfirm (properties: ReactConfirmAlertProps) {
  const target = document.getElementById(properties.targetId || targetId)
  if (target) {
    root!.unmount()
  }
}

function addBodyClass () {
  document.body.classList.add('react-confirm-alert-body-element')
}

function removeBodyClass () {
  document.body.classList.remove('react-confirm-alert-body-element')
}

export function confirmAlert (properties: ReactConfirmAlertProps): void {
  addBodyClass()
  createSVGBlurReconfirm()
  createElementReconfirm(properties)
}
