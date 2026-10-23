import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import { confirm } from 'react-confirm-alert'
import './app.css'

// Default CSS plus one Tailwind class: the utility must win over --rca-button-bg without !important.
const mixed = () => confirm({ title: 'Mixed dialog', classNames: { button: 'bg-red-500' } })

// Tailwind only, as in plan section 2.10.
const pure = () => confirm({
  title: 'Pure dialog',
  unstyled: true,
  classNames: {
    dialog: 'fixed inset-0 m-0 open:grid size-full max-h-none max-w-none place-items-center bg-transparent p-4 backdrop:bg-black/40',
    panel: 'w-full max-w-md rounded-xl bg-blue-600 p-6 text-white shadow-xl',
    title: 'text-lg font-semibold',
    actions: 'mt-6 flex justify-end gap-2',
    button: 'rounded-md px-3 py-1.5 data-[variant=primary]:bg-white data-[variant=primary]:text-blue-600'
  }
})

function App() {
  return h('div', null, h('button', { onClick: mixed }, 'Mixed'), h('button', { onClick: pure }, 'Pure'))
}

createRoot(document.getElementById('root')).render(h(App))
