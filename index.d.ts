declare module 'react-confirm-alert' {
  export interface ReactConfirmAlertProps {
    title?: string
    message?: string
    buttons?: Array<{
      label: string
      onClick: () => void
    }>
    childrenElement?: () => React.ReactNode
    customUI?: (customUiOptions: {
      title: string
      message: string
      onClose: () => void
    }) => React.ReactNode
    willUnmount?: () => void
    onClickOutside?: () => void
    onKeypressEscape?: () => void
  }

  export function confirmAlert(options: ReactConfirmAlertProps): void

  export default class ReactConfirmAlert extends React.Component<ReactConfirmAlertProps> {}
}
