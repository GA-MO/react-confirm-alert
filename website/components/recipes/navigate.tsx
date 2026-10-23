'use client'
import { useRouter } from 'next/navigation'
import { confirm } from 'react-confirm-alert'

// Demo only: leaves for the Vite recipe while the dialog is open, so dismissKey closes it.
export function NavigateAway() {
  const router = useRouter()
  return (
    <button
      onClick={() => {
        const timer = setTimeout(() => router.push('/docs/recipes/vite'), 2000)
        void confirm('This page changes in 2 seconds').then(() => clearTimeout(timer))
      }}
    >
      Open, then navigate
    </button>
  )
}
