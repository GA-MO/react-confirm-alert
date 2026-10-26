# react-confirm-alert

Confirm, alert and prompt dialogs for React 18 and 19. `await confirm()`, a native modal, focus that moves in and back, and the 3.0 `confirmAlert` unchanged.

[![npm version](https://img.shields.io/npm/v/react-confirm-alert.svg)](https://www.npmjs.com/package/react-confirm-alert)

[Docs](https://ga-mo.github.io/react-confirm-alert/docs/) · [Playground](https://ga-mo.github.io/react-confirm-alert/playground/) · [What's new in 3.1](https://ga-mo.github.io/react-confirm-alert/docs/whats-new-in-3-1/)

## Install

```bash
npm install react-confirm-alert
```

## Ask a question

```tsx
import { confirm } from 'react-confirm-alert'
import 'react-confirm-alert/style.css'

if (await confirm({ title: 'Delete file?', message: 'This cannot be undone.', tone: 'danger' })) {
  remove(file)
}
```

`style.css` needs 3.1.1 or later. The older path, `react-confirm-alert/src/react-confirm-alert.css`, still works.

`confirm()` resolves `true` or `false`. `alert()` and `prompt()` work the same way, and `<DialogHost />` placed inside your providers lets dialogs read their context.

## Custom UI

Put your own form, list or warning in a dialog. Plain HTML gets the default look, even under Tailwind v4 preflight, and any class you add wins:

```jsx
import { DialogLayout, openDialog } from 'react-confirm-alert'

const colour = await openDialog({
  render: ({ close, dismiss }) => (
    <DialogLayout title="Pick a colour" actions={[{ label: 'Cancel', onClick: dismiss }, { label: 'Blue', variant: 'primary', onClick: () => close('blue') }]}>
      <p>Used for the team badge.</p>
    </DialogLayout>
  )
}).result
```

3.0 `customUI` still works. Add `skin: true` for the new look:

```jsx
confirmAlert({
  skin: true,
  customUI: ({ onClose }) => (
    <>
      <h1>Leave the board?</h1>
      <p>You can join again from the invite link.</p>
      <button onClick={onClose}>Stay</button>
    </>
  )
})
```

`confirm`, `alert` and `prompt` take `content` for JSX between the message and the buttons. See [Custom UI](https://ga-mo.github.io/react-confirm-alert/docs/custom-ui/).

## 3.0 code keeps working

```jsx
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/style.css'

confirmAlert({
  title: 'Confirm to submit',
  message: 'Are you sure to do this.',
  buttons: [
    { label: 'Yes', onClick: () => alert('Click Yes') },
    { label: 'No', onClick: () => alert('Click No') }
  ]
})
```

Same options, DOM, class names and CSS path as 3.0.

## Tailwind CSS

```css
@import 'tailwindcss';
@import 'react-confirm-alert/style.css' layer(components);
```

```tsx
confirm({ title: 'Publish?', classNames: { button: 'rounded-full bg-red-500' } })
```

Importing the CSS into `layer(components)` lets Tailwind utilities win without `!important`. Or pass `unstyled: true` and style every slot yourself.

## Size

| Import | gzip |
|---|---|
| `import { confirmAlert }` | 3,769 B |
| `import { confirm }` | 4,042 B |
| CSS (the shipped file, not minified) | 2,909 B |

Measured on 2026-10-23 with size-limit 14.3.0 (`npx size-limit`, config in `.size-limit.json`): the ESM build bundled and minified with React and React DOM excluded, then gzipped. 3.0.6 measured the same way is 2,396 B, including `prop-types`. The extra bytes are the native modal, focus handling, stacked and queued dialogs, dialogs that render inside your providers, and the default look for your own content.

## Older versions

Docs for [v1](https://github.com/GA-MO/react-confirm-alert/blob/master/Document-v1.md) and [v2](https://github.com/GA-MO/react-confirm-alert/blob/master/Document-v2.md). For React 17 or older, use version 2.

## License

MIT
