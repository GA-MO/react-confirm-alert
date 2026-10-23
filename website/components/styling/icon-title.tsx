'use client'
import { confirm } from 'react-confirm-alert'
import './icon-title.css'

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  </svg>
)

export function IconTitle() {
  return (
    <button
      onClick={() =>
        confirm({
          title: (
            <span className="title-icon">
              <WarningIcon /> Delete project?
            </span>
          ),
          message: 'This deletes acme-web and all of its deploys.',
          tone: 'danger',
          confirmLabel: 'Delete',
        })
      }
    >
      Delete project
    </button>
  )
}
