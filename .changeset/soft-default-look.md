---
'react-confirm-alert': minor
---

New default look for `confirm`, `alert`, `prompt` and `<Dialog kind>`. Dialogs now use the app's font, and buttons have a clear order: Cancel is secondary, the action is primary, and `tone: 'danger'` is red. On narrow screens the buttons go full width. The prompt input gets its own padding, focus ring and error text. Opening, closing, hover, press and a waiting button are animated, and the animations turn off under reduced motion. Dark mode is opt-in: put `.dark` or `data-theme="dark"` on an ancestor such as `<html>`. Every colour can still be overridden with the existing `--rca-*` variables, and `--rca-border` and `--rca-ring` are new. `confirmAlert` keeps the 3.0 look.
