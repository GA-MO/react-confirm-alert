import ReactConfirmAlert, { confirmAlert, type ReactConfirmAlertProps } from 'react-confirm-alert'

const options: ReactConfirmAlertProps = {
  title: 'Title',
  message: 'Message',
  buttons: [{ label: 'Yes', onClick: () => {} }, { label: 'No', className: 'no' }],
  customUI: ({ title, onClose }) => title.length > 0 ? null : (onClose(), null),
  afterClose: () => {},
  onKeypressEscape: () => {},
  keyCodeForClose: [8, 32]
}
const result: void = confirmAlert(options)
const component: typeof ReactConfirmAlert = ReactConfirmAlert
export { result, component }
