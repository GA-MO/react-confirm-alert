import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { alert, closeAll, confirm, openDialog, prompt } from './api'
import { DialogStack } from './DialogStack'
import { ensureContainer } from './fallbackRoot'
import { installPageEffects } from './page'
import { addHost, removeHost, store } from './store'

export interface DialogHostProps {
  /** when this value changes, every open dialog is dismissed, e.g. pass the pathname */
  dismissKey?: unknown
}

// Renders the dialogs of confirmAlert, confirm and the rest where it is placed, so they see every
// provider above it (#23 #28 #35 #94). The top layer shows them above the page, so no portal.
export function DialogHost ({ dismissKey }: DialogHostProps) {
  const [host] = useState(() => Symbol('DialogHost'))
  useLayoutEffect(() => {
    installPageEffects()
    store.set(addHost(store.get(), host))
    return () => {
      store.set(removeHost(store.get(), host))
      // Dialogs this host was showing move to their own root instead of vanishing.
      if (store.get().hosts.length === 0 && store.get().entries.some((e) => e.target === null)) ensureContainer(null)
    }
  }, [])

  // Compares values, so StrictMode's second effect run with the same key closes nothing.
  const previous = useRef(dismissKey)
  useEffect(() => {
    if (Object.is(previous.current, dismissKey)) return
    previous.current = dismissKey
    closeAll()
  }, [dismissKey])

  return <DialogStack target={null} host={host} />
}

const dialogs = { alert, confirm, prompt, openDialog, closeAll }

/** The same functions as the module exports, so a component reads as one that opens dialogs. */
export function useDialog (): typeof dialogs {
  return dialogs
}
