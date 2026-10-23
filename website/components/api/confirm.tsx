'use client'
import { confirm } from 'react-confirm-alert'

export const deleteFile = () =>
  confirm({
    title: 'Delete “Q3 report.pdf”?',
    message: 'It moves to the trash for 30 days.',
    tone: 'danger',
    confirmLabel: 'Delete',
  })
