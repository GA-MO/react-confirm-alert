'use client'
import { useEffect } from 'react'
import { configureDialogs } from 'react-confirm-alert'
import type { Theme } from './themes'

// Puts the theme's variables and dark switch on <html>, where every dialog on the page inherits them,
// and takes them off again when the theme changes or the page unmounts.
export function useTheme(theme: Theme) {
  useEffect(() => {
    const root = document.documentElement
    const vars = Object.entries(theme.vars ?? {})
    for (const [name, value] of vars) root.style.setProperty(name, value)
    if (theme.dark) root.dataset.theme = 'dark'
    return () => {
      for (const [name] of vars) root.style.removeProperty(name)
      if (theme.dark) delete root.dataset.theme
    }
  }, [theme])
  // The hero dialog opens in the page, so the page keeps scrolling while it is open.
  useEffect(() => {
    configureDialogs({ lockScroll: false })
    return () => configureDialogs({})
  }, [])
}
