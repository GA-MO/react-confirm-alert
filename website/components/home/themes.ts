import type { DialogClassNames } from 'react-confirm-alert'

export type ThemeId = 'soft' | 'brand' | 'sharp' | 'dark' | 'tailwind'

export interface Theme {
  id: ThemeId
  label: string
  /** the chip's dot: its colour class and whether its corners are square */
  dot: string
  /** CSS variables on <html>, so the hero, the cards and every modal take them */
  vars?: Record<`--rca-${string}`, string>
  /** data-theme="dark" on <html>, the library's dark switch */
  dark?: boolean
  /** Tailwind classes for every slot, with the default CSS dropped */
  classNames?: DialogClassNames
  /** the setup the snippet shows; the variables and classes above produce exactly this */
  setup: { file: string, lang: 'tsx' | 'css', code: string }
}

const tailwind: DialogClassNames = {
  dialog: 'fixed inset-0 m-0 size-full max-h-none max-w-none open:grid place-items-center bg-transparent p-4 backdrop:bg-zinc-950/40',
  panel: 'w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-950/5',
  title: 'text-base font-semibold text-zinc-950',
  message: 'mt-1 text-sm text-zinc-500',
  actions: 'mt-6 flex justify-end gap-2',
  button: 'rounded-full px-4 py-2 text-sm font-medium text-zinc-700 ring-1 ring-zinc-200 data-[variant=primary]:bg-emerald-600 data-[variant=primary]:text-white data-[variant=primary]:ring-0',
}

const css = (vars: Record<string, string>) =>
  `:root {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`

// configureDialogs code for a classNames object, each class string wrapped to stay within 70 columns.
function configure(classNames: DialogClassNames) {
  const slot = ([name, value]: [string, string]) => {
    const lines = ['']
    for (const word of value.split(' ')) {
      const head = lines.length === 1 ? `    ${name}: '` : "      + ' "
      if ((head + lines.at(-1) + ' ' + word).length > 66 && lines.at(-1)) lines.push('')
      lines[lines.length - 1] = lines.at(-1) ? `${lines.at(-1)} ${word}` : word
    }
    return lines.map((l, i) => (i === 0 ? `    ${name}: '${l}` : `      + ' ${l}`)).join("'\n") + "',"
  }
  const body = Object.entries(classNames).map(([k, v]) => slot([k, v ?? ''])).join('\n')
  return `configureDialogs({\n  unstyled: true,\n  classNames: {\n${body}\n  },\n})`
}

const brand = { '--rca-button-bg': '#4f46e5' } as const
const sharp = { '--rca-radius': '0', '--rca-button-radius': '0' } as const

export const themes: readonly Theme[] = [
  {
    id: 'soft',
    label: 'Soft',
    dot: 'bg-zinc-900 dark:bg-zinc-100 rounded-full',
    setup: { file: 'app/layout.tsx', lang: 'tsx', code: "import 'react-confirm-alert/style.css'" },
  },
  {
    id: 'brand',
    label: 'Brand',
    dot: 'bg-indigo-600 rounded-full',
    vars: brand,
    setup: { file: 'app/globals.css', lang: 'css', code: css(brand) },
  },
  {
    id: 'sharp',
    label: 'Sharp',
    dot: 'bg-zinc-900 dark:bg-zinc-100 rounded-none',
    vars: sharp,
    setup: { file: 'app/globals.css', lang: 'css', code: css(sharp) },
  },
  {
    id: 'dark',
    label: 'Dark',
    dot: 'bg-zinc-950 ring-1 ring-zinc-500 rounded-full',
    dark: true,
    setup: { file: 'app/layout.tsx', lang: 'tsx', code: '<html data-theme="dark">' },
  },
  {
    id: 'tailwind',
    label: 'Tailwind',
    dot: 'bg-emerald-500 rounded-full',
    classNames: tailwind,
    setup: { file: 'app/dialogs.ts', lang: 'tsx', code: configure(tailwind) },
  },
]

// The hero's dialog; the stage renders the same options in place.
export const question = {
  title: 'Publish “Launch notes”?',
  message: 'Everyone in the workspace can read it.',
  confirmLabel: 'Publish',
} as const

export const call = `const ok = await confirm({
  title: '${question.title}',
  message: '${question.message}',
  confirmLabel: '${question.confirmLabel}',
})`
