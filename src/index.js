import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render, unmountComponentAtNode } from 'react-dom'

export default class ReactConfirmAlert extends Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    buttons: PropTypes.array.isRequired,
    childrenElement: PropTypes.func,
    customUI: PropTypes.func,
    closeOnClickOutside: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    willUnmount: PropTypes.func,
    onClickOutside: PropTypes.func,
    onKeypressEscape: PropTypes.func
  }

  static defaultProps = {
    buttons: [
      {
        label: 'Cancel',
        onClick: () => null
      },
      {
        label: 'Confirm',
        onClick: () => null
      }
    ],
    childrenElement: () => null,
    closeOnClickOutside: true,
    closeOnEscape: true,
    willUnmount: () => null,
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
  }

  close = () => {
    removeBodyClass()
    removeElementReconfirm()
    removeSVGBlurReconfirm()
  }

  keyboardClose = event => {
    const { closeOnEscape, onKeypressEscape } = this.props
    const isKeyCodeEscape = event.keyCode === 27

    if (closeOnEscape && isKeyCodeEscape) {
      onKeypressEscape(event)
      this.close()
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.keyboardClose, false)
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.keyboardClose, false)
    this.props.willUnmount()
  }

  renderCustomUI = () => {
    const { title, message, customUI } = this.props
    const dataCustomUI = {
      title,
      message,
      onClose: this.close
    }

    return customUI(dataCustomUI)
  }

  render () {
    const { title, message, buttons, childrenElement, customUI } = this.props

    return (
      <div
        className='react-confirm-alert-overlay'
        ref={dom => (this.overlay = dom)}
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
                  <button key={i} onClick={() => this.handleClickButton(button)}>
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

function removeSVGBlurReconfirm () {
  const svg = document.getElementById('react-confirm-alert-firm-svg')
  svg.parentNode.removeChild(svg)
  document.body.children[0].classList.remove('react-confirm-alert-blur')
}

function createElementReconfirm (properties) {
  let divTarget = document.getElementById('react-confirm-alert')
  if (divTarget) {
    // Rerender - the mounted ReactConfirmAlert
    render(<ReactConfirmAlert {...properties} />, divTarget)
  } else {
    // Mount the ReactConfirmAlert component
    document.body.children[0].classList.add('react-confirm-alert-blur')
    divTarget = document.createElement('div')
    divTarget.id = 'react-confirm-alert'
    document.body.appendChild(divTarget)
    render(<ReactConfirmAlert {...properties} />, divTarget)
  }
}

function removeElementReconfirm () {
  const target = document.getElementById('react-confirm-alert')
  unmountComponentAtNode(target)
  target.parentNode.removeChild(target)
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
