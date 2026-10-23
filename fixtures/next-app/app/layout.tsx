import type { ReactNode } from 'react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import ReactConfirmAlert from 'react-confirm-alert'
import { Dialogs } from './dialogs'
import { OpenButton } from './open-button'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OpenButton />
        {children}
        <Dialogs />
        {false && <ReactConfirmAlert title="Never rendered" />}
      </body>
    </html>
  )
}
