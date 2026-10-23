---
'react-confirm-alert': minor
---

Custom UI gets the default look with no class names. Inside a dialog with the new look, plain `h1` to `h3`, `p`, `label`, `input`, `textarea`, `select` and `button` are styled under `:where()`, so any class you add wins and Tailwind v4 preflight does not strip them. Radios and checkboxes take the skin accent colour. `unstyled: true` turns them off.

- `DialogLayout` renders a title, a message, your content and a row of actions. An action whose `onClick` returns a Promise is busy until it settles.
- `confirm`, `alert` and `prompt` take `content`: your JSX between the message and the buttons. `message` can be JSX.
- `confirmAlert({ skin: true })` and `configureDialogs({ confirmAlert: { skin: true } })` give `confirmAlert`, including `customUI`, the new look. Without `skin`, `confirmAlert` keeps the 3.0 look.
- The playground opens on Custom UI examples, and the docs have a Custom UI page.

Size budgets grow to match: `confirmAlert` 3.8 kB, `confirm` 4.1 kB, the CJS bundle 6.6 kB and the CSS 2.95 kB (gzip). The bytes are the skin option, `content`, `DialogLayout` and the plain element rules, which repeat the button hover rules for plain buttons.
