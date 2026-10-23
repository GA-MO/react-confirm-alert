'use client'
import { configureDialogs, confirm } from 'react-confirm-alert'

// Call once, where your app starts.
export const setThaiLabels = () =>
  configureDialogs({ labels: { confirm: 'ลบ', cancel: 'ยกเลิก' } })

export const deleteInThai = () =>
  confirm({ title: 'ลบไฟล์นี้ไหม', tone: 'danger' })
