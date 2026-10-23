'use client'
import { closeAll, confirm } from 'react-confirm-alert'

export function askThenClose() {
  setTimeout(closeAll, 2000)
  return confirm('This closes in 2 seconds')
}
