---
"react-confirm-alert": minor
---

Add `confirm()`, `alert()`, `prompt()` and `openDialog()`, which return a Promise, plus `closeDialog()` and `closeAll()`. Buttons whose `onClick` returns a Promise show a busy state until it settles. Dialogs stack by default, or queue with `strategy: 'queue'`. `confirmAlert` keeps its v3 behavior.
