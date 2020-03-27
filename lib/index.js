'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

exports.confirmAlert = confirmAlert;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactConfirmAlert = (_temp2 = _class = function (_Component) {
  _inherits(ReactConfirmAlert, _Component);

  function ReactConfirmAlert() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactConfirmAlert);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactConfirmAlert.__proto__ || Object.getPrototypeOf(ReactConfirmAlert)).call.apply(_ref, [this].concat(args))), _this), _this.handleClickButton = function (button) {
      if (button.onClick) button.onClick();
      _this.close();
    }, _this.handleClickOverlay = function (e) {
      var _this$props = _this.props,
          closeOnClickOutside = _this$props.closeOnClickOutside,
          onClickOutside = _this$props.onClickOutside;

      var isClickOutside = e.target === _this.overlay;

      if (closeOnClickOutside && isClickOutside) {
        onClickOutside();
        _this.close();
      }
    }, _this.close = function () {
      try {
        var afterClose = _this.props.afterClose;

        if (openModalsCount === 1) {
          removeBodyClass();
          removeSVGBlurReconfirm();
        }
        removeElementReconfirm();
        afterClose();
      } finally {
        openModalsCount--;
      }
    }, _this.keyboardClose = function (event) {
      var _this$props2 = _this.props,
          closeOnEscape = _this$props2.closeOnEscape,
          onKeypressEscape = _this$props2.onKeypressEscape;

      var isKeyCodeEscape = event.keyCode === 27;

      if (closeOnEscape && isKeyCodeEscape) {
        onKeypressEscape(event);
        _this.close();
      }
    }, _this.componentDidMount = function () {
      document.addEventListener('keydown', _this.keyboardClose, false);
    }, _this.componentWillUnmount = function () {
      document.removeEventListener('keydown', _this.keyboardClose, false);
      _this.props.willUnmount();
    }, _this.renderCustomUI = function () {
      var _this$props3 = _this.props,
          title = _this$props3.title,
          message = _this$props3.message,
          buttons = _this$props3.buttons,
          customUI = _this$props3.customUI;

      var dataCustomUI = {
        title: title,
        message: message,
        buttons: buttons,
        onClose: _this.close
      };

      return customUI(dataCustomUI);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReactConfirmAlert, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          title = _props.title,
          message = _props.message,
          buttons = _props.buttons,
          childrenElement = _props.childrenElement,
          customUI = _props.customUI;


      return _react2.default.createElement(
        'div',
        {
          className: 'react-confirm-alert-overlay',
          ref: function ref(dom) {
            return _this2.overlay = dom;
          },
          onClick: this.handleClickOverlay
        },
        _react2.default.createElement(
          'div',
          { className: 'react-confirm-alert' },
          customUI ? this.renderCustomUI() : _react2.default.createElement(
            'div',
            { className: 'react-confirm-alert-body' },
            title && _react2.default.createElement(
              'h1',
              null,
              title
            ),
            message,
            childrenElement(),
            _react2.default.createElement(
              'div',
              { className: 'react-confirm-alert-button-group' },
              buttons.map(function (button, i) {
                return _react2.default.createElement(
                  'button',
                  { key: i, onClick: function onClick() {
                      return _this2.handleClickButton(button);
                    }, className: button.className },
                  button.label
                );
              })
            )
          )
        )
      );
    }
  }]);

  return ReactConfirmAlert;
}(_react.Component), _class.propTypes = {
  title: _propTypes2.default.string,
  message: _propTypes2.default.string,
  buttons: _propTypes2.default.array.isRequired,
  childrenElement: _propTypes2.default.func,
  customUI: _propTypes2.default.func,
  closeOnClickOutside: _propTypes2.default.bool,
  closeOnEscape: _propTypes2.default.bool,
  willUnmount: _propTypes2.default.func,
  afterClose: _propTypes2.default.func,
  onClickOutside: _propTypes2.default.func,
  onKeypressEscape: _propTypes2.default.func
}, _class.defaultProps = {
  buttons: [{
    label: 'Cancel',
    onClick: function onClick() {
      return null;
    },
    className: null
  }, {
    label: 'Confirm',
    onClick: function onClick() {
      return null;
    },
    className: null
  }],
  childrenElement: function childrenElement() {
    return null;
  },
  closeOnClickOutside: true,
  closeOnEscape: true,
  willUnmount: function willUnmount() {
    return null;
  },
  afterClose: function afterClose() {
    return null;
  },
  onClickOutside: function onClickOutside() {
    return null;
  },
  onKeypressEscape: function onKeypressEscape() {
    return null;
  }
}, _temp2);
exports.default = ReactConfirmAlert;


var openModalsCount = 0;

function createSVGBlurReconfirm() {
  // If has svg ignore to create the svg
  var svg = document.getElementById('react-confirm-alert-firm-svg');
  if (svg) return;
  var svgNS = 'http://www.w3.org/2000/svg';
  var feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur');
  feGaussianBlur.setAttribute('stdDeviation', '0.3');

  var filter = document.createElementNS(svgNS, 'filter');
  filter.setAttribute('id', 'gaussian-blur');
  filter.appendChild(feGaussianBlur);

  var svgElem = document.createElementNS(svgNS, 'svg');
  svgElem.setAttribute('id', 'react-confirm-alert-firm-svg');
  svgElem.setAttribute('class', 'react-confirm-alert-svg');
  svgElem.appendChild(filter);

  document.body.appendChild(svgElem);
}

function removeSVGBlurReconfirm() {
  var svg = document.getElementById('react-confirm-alert-firm-svg');
  svg.parentNode.removeChild(svg);
  document.body.children[0].classList.remove('react-confirm-alert-blur');
}

function createElementReconfirm(properties) {
  var divTarget = document.getElementById(getConfirmAlertId());
  if (divTarget) {
    // Rerender - the mounted ReactConfirmAlert
    (0, _reactDom.render)(_react2.default.createElement(ReactConfirmAlert, properties), divTarget);
  } else {
    // Mount the ReactConfirmAlert component
    document.body.children[0].classList.add('react-confirm-alert-blur');
    divTarget = document.createElement('div');
    divTarget.id = getConfirmAlertId();
    document.body.appendChild(divTarget);
    (0, _reactDom.render)(_react2.default.createElement(ReactConfirmAlert, properties), divTarget);
  }
}

function removeElementReconfirm() {
  var target = document.getElementById(getConfirmAlertId());
  if (target) {
    (0, _reactDom.unmountComponentAtNode)(target);
    target.parentNode.removeChild(target);
  }
}

function addBodyClass() {
  document.body.classList.add('react-confirm-alert-body-element');
}

function removeBodyClass() {
  document.body.classList.remove('react-confirm-alert-body-element');
}

function getConfirmAlertId() {
  return 'react-confirm-alert' + openModalsCount;
}

function confirmAlert(properties) {
  openModalsCount++;
  if (openModalsCount === 1) {
    addBodyClass();
    createSVGBlurReconfirm();
  }
  createElementReconfirm(properties);
}