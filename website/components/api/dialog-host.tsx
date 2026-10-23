'use client'
import { useTheme } from 'next-themes'
import { alert } from 'react-confirm-alert'

export function ThemeName() {
  return <p>This site is in {useTheme().resolvedTheme} mode.</p>
}

export function ShowTheme() {
  return (
    <button onClick={() => alert({ content: <ThemeName /> })}>
      Show theme
    </button>
  )
}
