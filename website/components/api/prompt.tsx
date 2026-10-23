'use client'
import { prompt } from 'react-confirm-alert'

export const renameFile = () =>
  prompt({
    title: 'Rename file',
    defaultValue: 'Q3 report.pdf',
    validate: (name) => (name.trim() ? null : 'Give it a name'),
  })
