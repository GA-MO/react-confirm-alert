import React, { PropTypes, Component } from 'react';
import { render } from 'react-dom';

export default class ReactConfirmAlert extends Component {

  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    confirmLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    children: PropTypes.node,
  };

  static defaultProps = {
    title: 'Confirm',
    message: 'Are you sure to do this.',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
  };

  onClickConfirm = () => {
    this.props.onConfirm();
    this.close()
  };

  onClickCancel = () => {
    this.props.onCancel();
    this.close()
  };

  close = () => {
    const target = document.getElementById('react-confirm-alert');
    const svg = document.getElementById('react-confirm-alert-firm-svg');
    target.parentNode.removeChild(target);
    svg.parentNode.removeChild(svg);
    const root = document.body.children[0];
    root.classList.remove('react-confirm-alert-blur');
  }

  render() {

    const {
      title,
      message,
      confirmLabel,
      cancelLabel,
      children,
    } = this.props;

    return (
      <div className="react-confirm-alert-overlay">
        <div className="react-confirm-alert">
          <h1>{title}</h1>
          <h3>{message}</h3>
          {children}
          <div className="react-confirm-alert-button-group">
            <button onClick={this.onClickCancel}>{cancelLabel}</button>
            <button onClick={this.onClickConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    );
  }
}

function createSVG() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur');
  feGaussianBlur.setAttribute('stdDeviation', '0.7');

  const filter = document.createElementNS(svgNS, 'filter');
  filter.setAttribute('id', 'gaussian-blur');
  filter.appendChild(feGaussianBlur);

  const svgElem = document.createElementNS(svgNS, 'svg');
  svgElem.setAttribute('id', 'react-confirm-alert-firm-svg');
  svgElem.appendChild(filter);

  document.body.appendChild(svgElem);
}

function createElemetReconfirm(properties) {
  document.body.children[0].classList.add('react-confirm-alert-blur');
  const divTarget = document.createElement('div');
  divTarget.id = 'react-confirm-alert';
  document.body.appendChild(divTarget);
  render(<ReactConfirmAlert {...properties} />, divTarget);
}

export function confirmAlert(properties) {
  createSVG()
  createElemetReconfirm(properties)
}

