'use client'
import { confirm } from 'react-confirm-alert'

const save = () => new Promise<void>((r) => setTimeout(r, 1500))

export const publish = () =>
  confirm({
    title: 'Publish changes?',
    confirmLabel: 'Publish',
    onConfirm: save,
  })
