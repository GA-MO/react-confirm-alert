'use client'
import { confirm } from 'react-confirm-alert'

export const archiveBoard = () =>
  confirm({
    title: 'Archive “Launch” board?',
    content: <p>12 cards move to the archive with it.</p>,
    confirmLabel: 'Archive',
  })
