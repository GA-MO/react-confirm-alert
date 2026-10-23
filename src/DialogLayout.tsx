import { Fragment, useContext, type ReactElement } from 'react'
import { useBusy } from './api'
import { FrameContext, useSlot } from './classNames'
import type { DialogLayoutProps } from './types'

/** The default dialog layout for your own content: title, message, your children, then the actions. */
export function DialogLayout ({ title, message, actions, children }: DialogLayoutProps): ReactElement {
  const slot = useSlot()
  const frame = useContext(FrameContext)
  const [busy, setBusy] = useBusy(frame.id)
  // Inside a skinned customUI the body is already there.
  const Body = frame.inBody ? Fragment : 'div'
  return (
    <Body {...(frame.inBody ? {} : slot('body'))}>
      {title != null && <h1 id={frame.titleId} {...slot('title')}>{title}</h1>}
      {message != null && <div {...slot('message')}>{message}</div>}
      {children}
      {actions && actions.length > 0 && (
        <div {...slot('actions')}>
          {actions.map(({ label, variant = 'secondary', onClick, disabled, className, ...rest }, i) => (
            <button
              key={i}
              type='button'
              {...rest}
              {...slot('button', className)}
              data-variant={variant}
              data-busy={busy === i ? '' : undefined}
              aria-busy={busy === i || undefined}
              disabled={disabled || busy !== null}
              onClick={(event) => {
                const outcome = onClick?.(event)
                if (!(outcome instanceof Promise)) return
                setBusy(i)
                outcome.catch((error: unknown) => console.error(error)).finally(() => setBusy(null))
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </Body>
  )
}
