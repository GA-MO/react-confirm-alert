// Builds a complete, copyable component from the playground's current options.
export interface SnippetOptions {
  title: string
  message: string
  danger: boolean
  modal: boolean
  closeOnEscape: boolean
  closeOnClickOutside: boolean
}
export type StyleMode = 'default' | 'variables' | 'mixed' | 'tailwind'

const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

function literal (o: SnippetOptions, extra: string[] = [], indent = '    ') {
  const lines = [
    `title: ${q(o.title)},`,
    o.message && `message: ${q(o.message)},`,
    o.danger && "tone: 'danger',",
    !o.modal && 'modal: false,',
    !o.closeOnEscape && 'closeOnEscape: false,',
    !o.closeOnClickOutside && 'closeOnClickOutside: false,',
    ...extra
  ].filter(Boolean)
  return `{\n${lines.map((l) => `${indent}  ${l}`).join('\n')}\n${indent}}`
}

const css = "import 'react-confirm-alert/style.css'\n"

// What each Styling choice adds above the component: the CSS import, a variable, configureDialogs.
function styleSetup (style: StyleMode, width: number): { imports: string, setup: string } {
  switch (style) {
    case 'default':
      return { imports: css, setup: '' }
    case 'variables':
      return { imports: css, setup: `// In your CSS: :root { --rca-width: ${width}px; }\n\n` }
    case 'mixed':
      return {
        imports: css,
        setup: [
          'configureDialogs({',
          "  classNames: { button: 'rounded-full active:scale-95' },",
          '})',
          '',
          ''
        ].join('\n')
      }
    case 'tailwind':
      return {
        imports: '',
        setup: [
          '// No library CSS: unstyled drops it, the classes style it.',
          'configureDialogs({',
          '  unstyled: true,',
          '  classNames: {',
          "    dialog: 'fixed inset-0 m-0 open:grid size-full max-w-none'",
          "      + ' place-items-center bg-transparent backdrop:bg-black/40',",
          "    panel: 'w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl',",
          "    title: 'text-lg font-semibold',",
          "    message: 'mt-2 text-sm text-zinc-500',",
          "    actions: 'mt-6 flex justify-end gap-2',",
          "    button: 'rounded-md px-3 py-1.5 data-[variant=primary]:bg-black'",
          "      + ' data-[variant=primary]:text-white',",
          '  },',
          '})',
          '',
          ''
        ].join('\n')
      }
  }
}

// The file header: imports for the used functions plus whatever the Styling choice needs.
function head (fn: string[], style: StyleMode, width: number) {
  const { imports, setup } = styleSetup(style, width)
  const names = style === 'mixed' || style === 'tailwind' ? [...fn, 'configureDialogs'] : fn
  const list = names.sort().join(', ')
  const line = `import { ${list} } from 'react-confirm-alert'`
  return `'use client'
import { useState } from 'react'
${line.length > 70 ? `import {\n  ${names.join(',\n  ')},\n} from 'react-confirm-alert'` : line}
${imports}
${setup}`
}

function component (fn: string[], body: string, style: StyleMode, width: number, label = 'Open dialog') {
  return `${head(fn, style, width)}export function Example() {
  const [result, setResult] = useState('')

  async function onClick() {
${body}
  }

  return (
    <>
      <button onClick={onClick}>${label}</button>
      <output>{result}</output>
    </>
  )
}
`
}

export function snippet (id: string, o: SnippetOptions, style: StyleMode, width: number): string {
  const c = (fn: string[], body: string, s: StyleMode = style) => component(fn, body, s, width)
  switch (id) {
    case 'confirm':
      return c(['confirm'], `    const ok = await confirm(${literal(o)})\n    setResult(\`confirm() → \${ok}\`)`)
    case 'alert':
      return c(['alert'], `    await alert(${literal(o)})\n    setResult('alert() resolved')`)
    case 'prompt':
      return c(['prompt'], `    const name = await prompt(${literal(o, ["validate: (v) => (v.trim() ? null : 'Required'),"])})\n    setResult(\`prompt() → \${name}\`)`)
    case 'async':
      return c(['confirm'], `    const ok = await confirm(${literal(o, ['// Busy until the Promise settles.', 'onConfirm: () => new Promise((r) => setTimeout(r, 1500)),'])})\n    setResult(\`confirm() → \${ok}\`)`)
    case 'queue':
      return c(['alert'], "    for (const title of ['One', 'Two', 'Three']) {\n      void alert({ title, strategy: 'queue' })\n    }\n    setResult('three alerts, one at a time')")
    case 'closeAll':
      return c(['confirm', 'closeAll'], `    setTimeout(closeAll, 1500)\n    const ok = await confirm(${literal(o)})\n    setResult(\`confirm() → \${ok}\`)`)
    case 'stack':
      return c(['confirm', 'openDialog'], "    openDialog({\n      render: () => (\n        <button onClick={() => confirm('Level 2')}>\n          Open level 2\n        </button>\n      ),\n    })")
    case 'custom':
      return c(['openDialog'], "    const { result } = openDialog<string>({\n      render: ({ close }) => (\n        <form\n          className=\"react-confirm-alert-body\"\n          onSubmit={(e) => {\n            e.preventDefault()\n            const data = new FormData(e.currentTarget)\n            close(data.get('colour') as string)\n          }}\n        >\n          <h1 data-slot=\"title\">Pick a colour</h1>\n          <div data-slot=\"field\">\n            <label htmlFor=\"colour\" data-slot=\"label\">Colour</label>\n            <select id=\"colour\" name=\"colour\" data-slot=\"input\">\n              <option>red</option>\n              <option>green</option>\n              <option>blue</option>\n            </select>\n          </div>\n          <div\n            className=\"react-confirm-alert-button-group\"\n            data-slot=\"actions\"\n          >\n            <button data-variant=\"primary\">Pick</button>\n          </div>\n        </form>\n      ),\n    })\n    setResult(`openDialog() → ${await result}`)")
    case 'v3':
      return c(['confirmAlert'], `    confirmAlert(${literal({ ...o, danger: false, modal: true }, ['buttons: [', "  { label: 'Yes', onClick: () => setResult('Yes') },", "  { label: 'No', onClick: () => setResult('No') },", '],'])})`, 'default')
    case 'customUI':
      return c(['confirmAlert'], "    confirmAlert({\n      customUI: ({ onClose }) => (\n        <div className=\"custom-ui\">\n          <h1>Custom UI</h1>\n          <button onClick={onClose}>Close</button>\n        </div>\n      ),\n    })", 'default')
    case 'route':
      return `'use client'\n// app/dialogs.tsx, rendered once in the root layout\nimport { usePathname } from 'next/navigation'\nimport { DialogHost } from 'react-confirm-alert'\n\nexport function Dialogs() {\n  return <DialogHost dismissKey={usePathname()} />\n}\n`
    default:
      return `${head(['Dialog'], style, width)}export function EditNote() {\n  const [open, setOpen] = useState(false)\n  const [note, setNote] = useState('')\n\n  return (\n    <>\n      <button onClick={() => setOpen(true)}>Edit note</button>\n      <Dialog\n        open={open}\n        onOpenChange={setOpen}\n        aria-labelledby=\"note-title\"\n      >\n        <div className=\"react-confirm-alert-body\">\n          <h1 id=\"note-title\" data-slot=\"title\">Edit note</h1>\n          <div data-slot=\"field\">\n            <label htmlFor=\"note\" data-slot=\"label\">Note</label>\n            <textarea\n              id=\"note\"\n              data-slot=\"input\"\n              value={note}\n              onChange={(e) => setNote(e.target.value)}\n            />\n          </div>\n          <div\n            className=\"react-confirm-alert-button-group\"\n            data-slot=\"actions\"\n          >\n            <button\n              data-variant=\"primary\"\n              onClick={() => setOpen(false)}\n            >\n              Done\n            </button>\n          </div>\n        </div>\n      </Dialog>\n    </>\n  )\n}\n`
  }
}
