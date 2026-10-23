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

const styleSetup: Record<StyleMode, string> = {
  default: '',
  variables: "// app.css: :root { --rca-width: 480px; }\n",
  mixed: "configureDialogs({\n  classNames: { button: 'rounded-full' },\n})\n\n",
  tailwind: [
    'configureDialogs({',
    '  unstyled: true,',
    '  classNames: {',
    "    dialog: 'fixed inset-0 m-0 open:grid size-full max-w-none'",
    "      + ' place-items-center bg-transparent backdrop:bg-black/40',",
    "    panel: 'w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl',",
    "    actions: 'mt-6 flex justify-end gap-2',",
    "    button: 'rounded-md px-3 py-1.5 data-[variant=primary]:bg-black'",
    "      + ' data-[variant=primary]:text-white',",
    '  },',
    '})',
    '',
    ''
  ].join('\n')
}

function component (fn: string[], body: string, style: StyleMode, label = 'Open') {
  const needsConfigure = style === 'mixed' || style === 'tailwind'
  const names = needsConfigure ? [...fn, 'configureDialogs'] : fn
  return `'use client'
import { useState } from 'react'
import { ${names.sort().join(', ')} } from 'react-confirm-alert'

${styleSetup[style]}export function Example() {
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

export function snippet (id: string, o: SnippetOptions, style: StyleMode): string {
  switch (id) {
    case 'confirm':
      return component(['confirm'], `    const ok = await confirm(${literal(o)})\n    setResult(\`confirm() → \${ok}\`)`, style)
    case 'alert':
      return component(['alert'], `    await alert(${literal(o)})\n    setResult('alert() resolved')`, style)
    case 'prompt':
      return component(['prompt'], `    const name = await prompt(${literal(o, ["validate: (v) => (v.trim() ? null : 'Required'),"])})\n    setResult(\`prompt() → \${name}\`)`, style)
    case 'async':
      return component(['confirm'], `    const ok = await confirm(${literal(o, ['// Busy until the Promise settles.', 'onConfirm: () => new Promise((r) => setTimeout(r, 1500)),'])})\n    setResult(\`confirm() → \${ok}\`)`, style)
    case 'queue':
      return component(['alert'], "    for (const title of ['One', 'Two', 'Three']) {\n      void alert({ title, strategy: 'queue' })\n    }\n    setResult('three alerts, one at a time')", style)
    case 'closeAll':
      return component(['confirm', 'closeAll'], `    setTimeout(closeAll, 1500)\n    const ok = await confirm(${literal(o)})\n    setResult(\`confirm() → \${ok}\`)`, style)
    case 'stack':
      return component(['confirm', 'openDialog'], "    openDialog({\n      render: () => (\n        <button onClick={() => confirm('Level 2')}>\n          Open level 2\n        </button>\n      ),\n    })", style)
    case 'custom':
      return component(['openDialog'], "    const { result } = openDialog<string>({\n      render: ({ close }) => (\n        <button onClick={() => close('blue')}>Blue</button>\n      ),\n    })\n    setResult(`openDialog() → ${await result}`)", style)
    case 'v3':
      return component(['confirmAlert'], `    confirmAlert(${literal({ ...o, danger: false, modal: true }, ['buttons: [', "  { label: 'Yes', onClick: () => setResult('Yes') },", "  { label: 'No', onClick: () => setResult('No') },", '],'])})`, 'default')
    case 'customUI':
      return component(['confirmAlert'], "    confirmAlert({\n      customUI: ({ onClose }) => (\n        <div className=\"custom-ui\">\n          <h1>Custom UI</h1>\n          <button onClick={onClose}>Close</button>\n        </div>\n      ),\n    })", 'default')
    case 'route':
      return `'use client'\n// app/dialogs.tsx, rendered once in the root layout\nimport { usePathname } from 'next/navigation'\nimport { DialogHost } from 'react-confirm-alert'\n\nexport function Dialogs() {\n  return <DialogHost dismissKey={usePathname()} />\n}\n`
    default:
      return `'use client'\nimport { useState } from 'react'\nimport { Dialog } from 'react-confirm-alert'\n\nexport function EditNote() {\n  const [open, setOpen] = useState(false)\n  const [note, setNote] = useState('')\n\n  return (\n    <>\n      <button onClick={() => setOpen(true)}>Edit note</button>\n      <Dialog open={open} onOpenChange={setOpen} aria-label="Note">\n        <textarea\n          value={note}\n          onChange={(e) => setNote(e.target.value)}\n        />\n      </Dialog>\n    </>\n  )\n}\n`
  }
}
