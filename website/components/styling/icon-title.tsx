'use client'
import { confirm } from 'react-confirm-alert'
import './icon-title.css'

export const WarningIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3 2 20h20Z" />
    <path d="M12 9v4m0 3v.01" />
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
