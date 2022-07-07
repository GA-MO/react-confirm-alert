import React, { ButtonHTMLAttributes } from 'react';

declare module 'react-confirm-alert' {
  export interface ReactConfirmAlertProps {
    targetId?: string
    title?: string
    message?: string
    buttons?: Array<{
      label: string
      className?: string
    } & ButtonHTMLAttributes<HTMLButtonElement>>
    childrenElement?: () => React.ReactNode
    customUI?: (customUiOptions: {
      title: string
      message: string
      onClose: () => void
    }) => React.ReactNode
    closeOnClickOutside?: boolean
    closeOnEscape?: boolean
    keyCodeForClose?: Array<number>
    willUnmount?: () => void
    onClickOutside?: () => void
    onKeypressEscape?: () => void
    onkeyPress?: () => void
    overlayClassName?: string
  }

  export function confirmAlert(options: ReactConfirmAlertProps): void

  export default class ReactConfirmAlert extends React.Component<ReactConfirmAlertProps> {}
}
