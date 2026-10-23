import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

function App() {
  return h('button', { onClick: () => confirmAlert({ title: 'Fixture dialog', message: 'Opened' }) }, 'Open')
}

createRoot(document.getElementById('root')).render(h(App))
