'use client'
import { alert } from 'react-confirm-alert'

export const showSaved = () =>
  alert({ title: 'Saved', message: 'Your changes are safe.' })
