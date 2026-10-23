import { createContext, useContext } from 'react'
import { runtime } from './store'
import type { DialogClassNames, DialogDefaults, DialogSlot, StyleOptions } from './types'

// The v3 class names, so v3 CSS overrides keep matching. Unstyled leaves them out.
const builtIn: Partial<Record<DialogSlot, string>> = {
  dialog: 'react-confirm-alert-overlay',
  panel: 'react-confirm-alert',
  body: 'react-confirm-alert-body',
  actions: 'react-confirm-alert-button-group'
}

/**
 * Style layers from widest to narrowest. confirmAlert keeps the v3 look unless the app sets
 * confirmAlert defaults, so app-wide unstyled or classNames never reach it by surprise.
 */
export function styleLayers (options: StyleOptions, legacy: boolean): StyleOptions[] {
  const defaults = runtime().defaults
  return [legacy ? defaults.confirmAlert ?? {} : defaults, options]
}

// The narrowest layer that sets unstyled decides it. Class names add up, they never replace.
export function classFor (slot: DialogSlot, layers: readonly StyleOptions[], extra?: string): string | undefined {
  const unstyled = layers.reduce<boolean | undefined>((u, l) => l.unstyled ?? u, undefined)
  const names = [unstyled ? undefined : builtIn[slot], ...layers.map((l) => l.classNames?.[slot]), extra]
  return names.filter(Boolean).join(' ') || undefined
}

export type SlotProps = (slot: DialogSlot, extra?: string) => { className: string | undefined, 'data-slot': DialogSlot }

export const slotsFor = (layers: readonly StyleOptions[]): SlotProps => (slot, extra) => ({
  className: classFor(slot, layers, extra),
  'data-slot': slot
})

export const SlotContext = createContext<SlotProps>(slotsFor([]))
export const useSlot = () => useContext(SlotContext)

export function configureDialogs (defaults: DialogDefaults): void {
  runtime().defaults = defaults
}

export type { DialogClassNames }
