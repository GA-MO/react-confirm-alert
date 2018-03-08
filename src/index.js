import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render, unmountComponentAtNode } from 'react-dom'

export default class ReactConfirmAlert extends Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    buttons: PropTypes.array.isRequired,
    children: PropTypes.node,
    childrenElement: PropTypes.func,
    customUI: PropTypes.func,
    willUnmount: PropTypes.func
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
    willUnmount: () => null
  }

  handleClickButton = button => {
    if (button.onClick) button.onClick()
    this.close()
  }

  close = () => {
    removeElementReconfirm()
    removeSVGBlurReconfirm()
  }

  componentWillUnmount = () => {
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
      <div className='react-confirm-alert-overlay'>
        <div className='react-confirm-alert'>
          {customUI
            ? this.renderCustomUI()
            : <div className='react-confirm-alert-body'>
              {title && <h1>{title}</h1>}
              {message}
              {childrenElement()}
              <div className='react-confirm-alert-button-group'>
                {buttons.map((button, i) => (
                  <button
                    key={i}
                    onClick={() => this.handleClickButton(button)}
                    >
                    {button.label}
                  </button>
                  ))}
              </div>
            </div>}
        </div>
      </div>
    )
  }
}

function createSVGBlurReconfirm () {
  const svgNS = 'http://www.w3.org/2000/svg'
  const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur')
  feGaussianBlur.setAttribute('stdDeviation', '0.7')

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
  document.body.children[0].classList.add('react-confirm-alert-blur')
  const divTarget = document.createElement('div')
  divTarget.id = 'react-confirm-alert'
  document.body.appendChild(divTarget)
  render(<ReactConfirmAlert {...properties} />, divTarget)
}

function removeElementReconfirm () {
  const target = document.getElementById('react-confirm-alert')
  unmountComponentAtNode(target)
  target.parentNode.removeChild(target)
}

export function confirmAlert (properties) {
  createSVGBlurReconfirm()
  createElementReconfirm(properties)
}
