'use client'
import { confirm } from 'react-confirm-alert'

export function TailwindOnly() {
  return (
    <button
      onClick={() =>
        confirm({
          title: 'Invite 3 people?',
          message: 'They get an email with a link to join.',
          confirmLabel: 'Send invites',
          unstyled: true,
          classNames: {
            // open:grid, not grid: a display class would also show the dialog while it is closed.
            dialog: 'fixed inset-0 m-0 size-full max-h-none max-w-none open:grid place-items-center bg-transparent p-4 backdrop:bg-black/40',
            panel: 'w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl',
            title: 'text-lg font-semibold text-zinc-950',
            message: 'mt-1 text-sm text-zinc-500',
            actions: 'mt-6 flex justify-end gap-2',
            button: 'rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 data-[variant=primary]:bg-emerald-600 data-[variant=primary]:text-white',
          },
        })
      }
    >
      Invite
    </button>
  )
}
