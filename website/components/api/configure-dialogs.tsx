'use client'
import { configureDialogs, confirm } from 'react-confirm-alert'

export function askInThai() {
  configureDialogs({ labels: { confirm: 'ลบ', cancel: 'ยกเลิก' } })
  return confirm({ title: 'ลบไฟล์นี้ไหม', tone: 'danger' })
}
