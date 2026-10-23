import { useContext, useId, useState, type FormEvent, type ReactNode, type ReactElement } from 'react'
import { closeDialog as closeEntry, openEntry } from './lifecycle'
import { runtime, store, update } from './store'
import { FrameContext, useSlot } from './classNames'
import type {
  AlertOptions,
  ConfirmOptions,
  CustomOptions,
  DialogButton,
  DialogHandle,
  DialogId,
  DialogRenderProps,
  EntryOptions,
  PromptOptions
} from './types'

type Body = (props: DialogRenderProps<any>, signal: AbortSignal) => ReactNode

// Opens an entry whose result settles once: with the value passed to close(), or with the kind's
// dismiss value for Escape, an outside click, closeAll or an aborted signal.
function open<R> (options: Omit<EntryOptions, 'render'>, dismissValue: R, body: Body) {
  if (typeof document === 'undefined') {
    return { id: '' as DialogId, result: Promise.reject(new Error('react-confirm-alert: dialogs need a browser')) as Promise<R> }
  }
  const controller = new AbortController()
  let resolve!: (value: R) => void
  const result = new Promise<R>((r) => { resolve = r })
  const settle = (value: unknown) => {
    if (controller.signal.aborted) return
    controller.abort()
    options.signal?.removeEventListener('abort', onAbort)
    resolve(value === undefined ? dismissValue : value as R)
  }
  const render = (props: DialogRenderProps<any>) => <>{body(props, controller.signal)}</>
  const onAbort = () => closeEntry(id)
  const id = openEntry({ ...options, render }, null, options.strategy ?? runtime().defaults.strategy ?? 'stack', settle)
  options.signal?.addEventListener('abort', onAbort, { once: true })
  if (options.signal?.aborted) closeEntry(id)
  return { id, result }
}

export function Body ({ props, children }: { props: DialogRenderProps<any>, children: ReactNode }): ReactElement {
  const slot = useSlot()
  const frame = useContext(FrameContext)
  return (
    <div {...slot('body')}>
      {props.title && <h1 id={props.titleId} {...slot('title')}>{props.title}</h1>}
      {props.message != null && (typeof props.message === 'object'
        ? <div id={props.descriptionId} {...slot('message')}>{props.message}</div>
        : <p id={props.descriptionId} {...slot('message')}>{props.message}</p>)}
      {props.content != null && <FrameContext.Provider value={{ ...frame, inBody: true }}>{props.content}</FrameContext.Provider>}
      {children}
    </div>
  )
}

// Which button waits. While one does, the frame has data-busy and Escape and outside clicks wait too.
export function useBusy (id: DialogId | undefined): [number | null, (index: number | null) => void] {
  const [busy, setBusy] = useState<number | null>(null)
  const mark = (index: number | null) => {
    if (id) {
      runtime().frames.get(id)?.frame.toggleAttribute('data-busy', index !== null)
      if (index === null) runtime().busy.delete(id)
      else runtime().busy.add(id)
    }
    setBusy(index)
  }
  return [busy, mark]
}

export function Buttons<R> ({ props, signal: getSignal, focus }: { props: DialogRenderProps<R>, signal: () => AbortSignal, focus: number }): ReactElement {
  const slot = useSlot()
  const [busy, setBusy] = useBusy(props.id)
  const press = async (button: DialogButton<R>, index: number) => {
    const signal = getSignal()
    let waiting = false
    try {
      const outcome = button.onClick?.({ close: props.close, dismiss: props.dismiss, signal })
      if (!(outcome instanceof Promise)) {
        if (outcome !== false) props.close(button.value as R)
        return
      }
      waiting = true
      setBusy(index)
      if ((await outcome) !== false && !signal.aborted) props.close(button.value as R)
    } catch (error) {
      console.error(error)
    } finally {
      if (waiting) setBusy(null)
    }
  }
  return (
    <div {...slot('actions')}>
      {props.buttons.map(({ label, value, variant = 'secondary', onClick, disabled, className, ...rest }, i) => (
        <button
          key={i}
          type='button'
          {...rest}
          {...slot('button', className)}
          data-variant={variant}
          data-busy={busy === i ? '' : undefined}
          data-autofocus={i === focus ? '' : undefined}
          aria-busy={busy === i || undefined}
          disabled={disabled || busy !== null}
          onClick={() => { void press(props.buttons[i]!, i) }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

const choice = (focus: number): Body => (props, signal) => (
  <Body props={props}><Buttons props={props} signal={() => signal} focus={focus} /></Body>
)

const normalize = <O,>(input: string | O): O => (typeof input === 'string' ? { title: input } as O : input)

export function alert (input: string | Omit<AlertOptions, 'kind'>): Promise<void> {
  const options = normalize(input)
  const buttons: DialogButton<void>[] = [{ label: options.okLabel ?? runtime().defaults.labels?.ok ?? 'OK', variant: 'primary' }]
  return open<void>({ ...options, kind: 'alert', buttons }, undefined, choice(0)).result
}

export function confirm (input: string | Omit<ConfirmOptions, 'kind'>): Promise<boolean> {
  const options = normalize(input)
  const danger = options.tone === 'danger'
  const { onConfirm } = options
  const buttons: DialogButton<boolean>[] = [
    { label: options.cancelLabel ?? runtime().defaults.labels?.cancel ?? 'Cancel', value: false },
    {
      label: options.confirmLabel ?? runtime().defaults.labels?.confirm ?? 'Confirm',
      value: true,
      variant: danger ? 'danger' : 'primary',
      onClick: onConfirm && (({ signal }) => onConfirm({ signal }))
    }
  ]
  return open({ ...options, kind: 'confirm', tone: options.tone, buttons }, false, choice(danger ? 0 : 1)).result
}

export function PromptBody ({ props, options }: { props: DialogRenderProps<string>, options: Omit<PromptOptions, 'kind'> }): ReactElement {
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const slot = useSlot()
  const inputId = useId()
  const errorId = useId()
  // The submit is always prevented: method=dialog would close the dialog before validate runs.
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = (event.currentTarget.elements.namedItem('value') as HTMLInputElement).value
    let message: string | null
    try {
      const check = options.validate?.(value) ?? null
      if (check instanceof Promise) setBusy(true)
      message = await check
    } catch (error) {
      console.error(error)
      return
    } finally {
      setBusy(false)
    }
    if (message) setError(message)
    else props.close(value)
  }
  return (
    <form method='dialog' noValidate onSubmit={(e) => { void onSubmit(e) }}>
      <Body props={props}>
        <div {...slot('field')}>
          {options.label && <label htmlFor={inputId} {...slot('label')}>{options.label}</label>}
          <input
            id={inputId}
            name='value'
            data-autofocus=''
            defaultValue={options.defaultValue}
            {...options.inputProps}
            {...slot('input', options.inputProps?.className)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          {error && <p id={errorId} {...slot('error')}>{error}</p>}
        </div>
        <div {...slot('actions')}>
          <button type='button' {...slot('button')} data-variant='secondary' onClick={props.dismiss}>
            {options.cancelLabel ?? runtime().defaults.labels?.cancel ?? 'Cancel'}
          </button>
          <button type='submit' {...slot('button')} data-variant='primary' aria-busy={busy || undefined} disabled={busy}>
            {options.submitLabel ?? runtime().defaults.labels?.submit ?? 'OK'}
          </button>
        </div>
      </Body>
    </form>
  )
}

export function prompt (input: string | Omit<PromptOptions, 'kind'>): Promise<string | null> {
  const options = normalize(input)
  return open<string | null>({ ...options, kind: 'prompt' }, null, (props) => <PromptBody props={props} options={options} />).result
}

export function openDialog<R = void> (options: Omit<CustomOptions<R>, 'kind'>): DialogHandle<R> {
  const { render: Render, ...rest } = options
  const { id, result } = open<R | undefined>({ ...rest, kind: 'custom' }, undefined, (props) => <Render {...props} />)
  return {
    id,
    result,
    close: (value) => {
      store.get().entries.find((e) => e.id === id)?.settle(value)
      closeEntry(id)
    },
    dismiss: () => closeEntry(id),
    update: (patch) => store.set(update(store.get(), id, patch as Partial<EntryOptions>))
  }
}

export function closeDialog (id: DialogId): void {
  closeEntry(id)
}

// Queued entries go first, so closing an open one cannot promote a queued one that is about to close.
export function closeAll (): void {
  for (const entry of [...store.get().entries].reverse()) closeEntry(entry.id)
}
