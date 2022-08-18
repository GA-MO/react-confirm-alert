import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createRoot } from 'react-dom/client'

export default class ReactConfirmAlert extends Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    width: PropTypes.string,
    buttons: PropTypes.array.isRequired,
    childrenElement: PropTypes.func,
    customUI: PropTypes.func,
    closeOnClickOutside: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    keyCodeForClose: PropTypes.arrayOf(PropTypes.number),
    willUnmount: PropTypes.func,
    afterClose: PropTypes.func,
    onClickOutside: PropTypes.func,
    onKeypressEscape: PropTypes.func,
    onkeyPress: PropTypes.func,
    overlayClassName: PropTypes.string
  }

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

  handleClickButton = button => {
    if (button.onClick) button.onClick()
    this.close()
  }

  handleClickOverlay = e => {
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

  keyboard = event => {
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
      title,
      message,
      buttons,
      onClose: this.close
    }

    return customUI(dataCustomUI)
  }

  render () {
    const { title, message, buttons, childrenElement, customUI, overlayClassName } = this.props

    return (
      <div
        className={`react-confirm-alert-overlay ${overlayClassName}`}
        ref={dom => (this.overlay = dom)}
        onClick={this.handleClickOverlay}
      >
        <div className='react-confirm-alert'>
          {customUI ? (
            this.renderCustomUI()
          ) : (
            <div style={{width:width}} className='react-confirm-alert-body'>
              {title && <h1>{title}</h1>}
              {message}
              {childrenElement()}
              <div className='react-confirm-alert-button-group'>
                {buttons.map((button, i) => (
                  <button
                    key={i}
                    className={button.className}
                    {...button}
                    onClick={(e) => this.handleClickButton(button)}
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

let root = null
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

function removeSVGBlurReconfirm (afterClose) {
  const svg = document.getElementById('react-confirm-alert-firm-svg')
  if (svg) {
    svg.parentNode.removeChild(svg)
  }
  document.body.children[0].classList.remove('react-confirm-alert-blur')
  afterClose()
}

function createElementReconfirm (properties) {
  let divTarget = document.getElementById(properties.targetId || targetId)

  if (properties.targetId && !divTarget) {
    console.error('React Confirm Alert:', `Can not get element id (#${properties.targetId})`)
  }

  if (divTarget) {
    root = createRoot(divTarget)
    root.render(<ReactConfirmAlert {...properties} />)
  } else {
    document.body.children[0].classList.add('react-confirm-alert-blur')
    divTarget = document.createElement('div')
    divTarget.id = targetId
    document.body.appendChild(divTarget)
    root = createRoot(divTarget)
    root.render(<ReactConfirmAlert {...properties} />)
  }
}

function removeElementReconfirm (properties) {
  const target = document.getElementById(properties.targetId || targetId)
  if (target) {
    root.unmount(target)
  }
}

function addBodyClass () {
  document.body.classList.add('react-confirm-alert-body-element')
}

function removeBodyClass () {
  document.body.classList.remove('react-confirm-alert-body-element')
}

export function confirmAlert (properties) {
  addBodyClass()
  createSVGBlurReconfirm()
  createElementReconfirm(properties)
}
