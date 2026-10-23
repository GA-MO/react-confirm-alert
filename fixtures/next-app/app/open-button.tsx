'use client'
import { confirmAlert } from 'react-confirm-alert'

export function OpenButton() {
  return <button onClick={() => confirmAlert({ title: 'Fixture dialog' })}>Open</button>
}
