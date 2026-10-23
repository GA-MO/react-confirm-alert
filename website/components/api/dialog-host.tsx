'use client'
import { useTheme } from 'next-themes'
import { alert } from 'react-confirm-alert'

export function ThemeName() {
  const theme = useTheme().resolvedTheme ?? 'light'
  return <p>This site is in {theme} mode.</p>
}

export function ShowTheme() {
  return (
    <button onClick={() => alert({ title: 'Theme', content: <ThemeName /> })}>
      Show theme
    </button>
  )
}
