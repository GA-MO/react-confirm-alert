import { runtime, store } from './store'

const BODY_CLASS = 'react-confirm-alert-body-element'
const BLUR_CLASS = 'react-confirm-alert-blur'

// Body classes follow the store, so stacked or replaced dialogs never leave a class behind and
// every open gets the blur again (#77).
export function syncPage () {
  const rt = runtime()
  const open = store.get().entries.filter((e) => e.phase === 'open')
  document.body.classList.toggle(BODY_CLASS, rt.defaults.lockScroll !== false && open.length + rt.inPlace > 0)
  const wantsBlur = open.some((e) => e.blur)
  if (wantsBlur && !rt.blurred) {
    rt.blurred = document.body.children[0] ?? null
    rt.blurred?.classList.add(BLUR_CLASS)
  } else if (!wantsBlur && rt.blurred) {
    rt.blurred.classList.remove(BLUR_CLASS)
    rt.blurred = null
  }
}

export function installPageEffects () {
  const rt = runtime()
  if (rt.pageSynced) return
  rt.pageSynced = true
  store.subscribe(syncPage)
}
