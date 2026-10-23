import { expectTypeOf } from 'vitest'
import { alert, confirm, confirmAlert, openDialog, prompt, type DialogHandle } from 'react-confirm-alert'

expectTypeOf(confirm('x')).toEqualTypeOf<Promise<boolean>>()
expectTypeOf(alert('x')).toEqualTypeOf<Promise<void>>()
expectTypeOf(prompt({ title: 'x', validate: (v) => (v ? null : 'no') })).toEqualTypeOf<Promise<string | null>>()
expectTypeOf(openDialog<number>({ render: ({ close }) => { close(1); return null } })).toEqualTypeOf<DialogHandle<number>>()
expectTypeOf(confirmAlert({ title: 'x' })).toEqualTypeOf<void>()

// @ts-expect-error a prompt has no confirmLabel
prompt({ title: 'x', confirmLabel: 'Yes' })
// @ts-expect-error close() takes the dialog's result type
openDialog<number>({ render: ({ close }) => { close('one'); return null } })
// @ts-expect-error kind is set by the function
confirm({ kind: 'alert', title: 'x' })
