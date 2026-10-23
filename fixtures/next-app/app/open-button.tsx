'use client'
import { useRouter } from 'next/navigation'
import { confirm, confirmAlert } from 'react-confirm-alert'

export function OpenButton() {
  const router = useRouter()
  return (
    <>
      <button onClick={() => confirmAlert({ title: 'Fixture dialog' })}>Open</button>
      <button
        onClick={() => {
          void confirm({ title: 'Navigating dialog' })
          setTimeout(() => router.push('/b'), 300)
        }}
      >
        Open and navigate
      </button>
    </>
  )
}
