import { createRoot } from 'react-dom/client'
import { DialogStack } from './DialogStack'
import { runtime, store } from './store'
import { installPageEffects } from './page'

const DEFAULT_ID = 'react-confirm-alert'

export function ensureContainer (target: string | null): { target: string | null, blur: boolean } {
  installPageEffects()
  if (target !== null && !document.getElementById(target)) {
    console.error('React Confirm Alert:', `Can not get element id (#${target})`)
    target = null
  }
  const { containers } = runtime()
  // A mounted DialogHost renders the default container's dialogs inside the app, so there is
  // no container to create and nothing to blur.
  if (target === null && store.get().hosts.length > 0) return { target, blur: false }
  let container = containers.get(target)
  if (!container || !container.element.isConnected) {
    let element = document.getElementById(target ?? DEFAULT_ID)
    const created = !element
    if (!element) {
      element = document.createElement('div')
      element.id = DEFAULT_ID
      document.body.appendChild(element)
    }
    const root = createRoot(element)
    root.render(<DialogStack target={target} />)
    container = { element, root, created }
    containers.set(target, container)
    watchForEmptyContainers()
  }
  return { target, blur: target === null && container.created }
}

function watchForEmptyContainers () {
  const rt = runtime()
  if (rt.watchingContainers) return
  rt.watchingContainers = true
  const { containers } = rt
  store.subscribe(() => {
    // Unmount outside the current React event, and only if nothing new arrived meanwhile.
    queueMicrotask(() => {
      for (const [target, container] of containers) {
        if (store.get().entries.some((e) => e.target === target)) continue
        containers.delete(target)
        container.root.unmount()
        if (container.created) container.element.remove()
      }
    })
  })
}
