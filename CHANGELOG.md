# react-confirm-alert

## 3.2.0

### Minor Changes

- [#101](https://github.com/GA-MO/react-confirm-alert/pull/101) [`22a8084`](https://github.com/GA-MO/react-confirm-alert/commit/22a80843a4952d894b61e207ada297451e265962) Thanks [@GA-MO](https://github.com/GA-MO)! - New default look for `confirm`, `alert`, `prompt` and `<Dialog kind>`. Dialogs now use the app's font, and buttons have a clear order: Cancel is secondary, the action is primary, and `tone: 'danger'` is red. On narrow screens the buttons go full width. The prompt input gets its own padding, focus ring and error text. Opening, closing, hover, press and a waiting button are animated, and the animations turn off under reduced motion. Dark mode is opt-in: put `.dark` or `data-theme="dark"` on an ancestor such as `<html>`. Every colour can still be overridden with the existing `--rca-*` variables, and `--rca-border` and `--rca-ring` are new. `confirmAlert` keeps the 3.0 look.

### Patch Changes

- [#101](https://github.com/GA-MO/react-confirm-alert/pull/101) [`22a8084`](https://github.com/GA-MO/react-confirm-alert/commit/22a80843a4952d894b61e207ada297451e265962) Thanks [@GA-MO](https://github.com/GA-MO)! - Closing a dialog from `onkeyPress` or `onKeyDown` on Enter no longer clicks the button that opened it, so the dialog doesn't open again in Chromium ([#84](https://github.com/GA-MO/react-confirm-alert/issues/84)).

- [#101](https://github.com/GA-MO/react-confirm-alert/pull/101) [`22a8084`](https://github.com/GA-MO/react-confirm-alert/commit/22a80843a4952d894b61e207ada297451e265962) Thanks [@GA-MO](https://github.com/GA-MO)! - `confirmAlert({ message: 'a\nb' })` keeps the line break, as `confirm` already does ([#38](https://github.com/GA-MO/react-confirm-alert/issues/38)).

## 3.1.1

### Patch Changes

- [#99](https://github.com/GA-MO/react-confirm-alert/pull/99) [`83cad54`](https://github.com/GA-MO/react-confirm-alert/commit/83cad544985803daee385a24df418373420db3c6) Thanks [@GA-MO](https://github.com/GA-MO)! - Add a shorter CSS path: `import 'react-confirm-alert/style.css'`. It is a copy of `src/react-confirm-alert.css`, which keeps working.

## 3.1.0

### Minor Changes

- [#95](https://github.com/GA-MO/react-confirm-alert/pull/95) [`eb5a808`](https://github.com/GA-MO/react-confirm-alert/commit/eb5a808481e4a399602478e45397e1f3a004d4c9) Thanks [@GA-MO](https://github.com/GA-MO)! - Add `<DialogHost>` so dialogs render inside your providers ([#23](https://github.com/GA-MO/react-confirm-alert/issues/23) [#28](https://github.com/GA-MO/react-confirm-alert/issues/28) [#35](https://github.com/GA-MO/react-confirm-alert/issues/35) [#94](https://github.com/GA-MO/react-confirm-alert/issues/94)) and close when `dismissKey` changes ([#93](https://github.com/GA-MO/react-confirm-alert/issues/93)), `<Dialog>` and `<ConfirmDialog>` that render in place ([#63](https://github.com/GA-MO/react-confirm-alert/issues/63) [#66](https://github.com/GA-MO/react-confirm-alert/issues/66)), `configureDialogs`, `classNames` for every slot, `unstyled`, data attributes and CSS variables ([#44](https://github.com/GA-MO/react-confirm-alert/issues/44) [#86](https://github.com/GA-MO/react-confirm-alert/issues/86)).

- [#89](https://github.com/GA-MO/react-confirm-alert/pull/89) Thanks [@IceFreez3r](https://github.com/IceFreez3r)! - `onkeyPress` now receives `(event, close)`, and every new dialog takes `onKeyDown(event, close)` ([#84](https://github.com/GA-MO/react-confirm-alert/issues/84)), based on [#89](https://github.com/GA-MO/react-confirm-alert/issues/89).

- [#47](https://github.com/GA-MO/react-confirm-alert/pull/47) Thanks [@vitalybe](https://github.com/vitalybe)! - Open a dialog from inside another with `strategy: 'stack'`, the default for the new API ([#46](https://github.com/GA-MO/react-confirm-alert/issues/46)), based on the idea in [#47](https://github.com/GA-MO/react-confirm-alert/issues/47).

- [#95](https://github.com/GA-MO/react-confirm-alert/pull/95) [`eb5a808`](https://github.com/GA-MO/react-confirm-alert/commit/eb5a808481e4a399602478e45397e1f3a004d4c9) Thanks [@GA-MO](https://github.com/GA-MO)! - Add `confirm()`, `alert()`, `prompt()` and `openDialog()`, which return a Promise, plus `closeDialog()` and `closeAll()`. Buttons whose `onClick` returns a Promise show a busy state until it settles. Dialogs stack by default, or queue with `strategy: 'queue'`. `confirmAlert` keeps its v3 behavior.

- [#72](https://github.com/GA-MO/react-confirm-alert/pull/72) Thanks [@dery168](https://github.com/dery168)! - Queue dialogs one at a time with `strategy: 'queue'`, based on the idea in [#72](https://github.com/GA-MO/react-confirm-alert/issues/72).

- [#64](https://github.com/GA-MO/react-confirm-alert/pull/64) Thanks [@YaSargis](https://github.com/YaSargis)! - Set the dialog width with the `--rca-width` CSS variable or `classNames.panel` ([#65](https://github.com/GA-MO/react-confirm-alert/issues/65)), based on [#64](https://github.com/GA-MO/react-confirm-alert/issues/64) and [#65](https://github.com/GA-MO/react-confirm-alert/issues/65).

### Patch Changes

- [#95](https://github.com/GA-MO/react-confirm-alert/pull/95) [`eb5a808`](https://github.com/GA-MO/react-confirm-alert/commit/eb5a808481e4a399602478e45397e1f3a004d4c9) Thanks [@GA-MO](https://github.com/GA-MO)! - Fix the blur that showed only on the first open ([#77](https://github.com/GA-MO/react-confirm-alert/issues/77)), the createRoot error when opening a dialog while one is open ([#82](https://github.com/GA-MO/react-confirm-alert/issues/82)), dialogs closing when a press starts inside and ends outside ([#92](https://github.com/GA-MO/react-confirm-alert/issues/92)), focus that stayed behind the dialog ([#29](https://github.com/GA-MO/react-confirm-alert/issues/29)), dialogs hidden under z-index 1050 with `modal: true` ([#31](https://github.com/GA-MO/react-confirm-alert/issues/31)), and the missing prop-types dependency that broke Vite ([#85](https://github.com/GA-MO/react-confirm-alert/issues/85)). react-dom's peer range is now >=18 ([#88](https://github.com/GA-MO/react-confirm-alert/issues/88)).
