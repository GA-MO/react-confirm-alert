---
'react-confirm-alert': patch
---

The primary and danger buttons in `confirm`, `alert` and `prompt` stay readable on hover. In 3.2.0 they turned light grey with white text. Now they get 15% darker, and you can set the colour with the new `--rca-button-bg-hover` and `--rca-danger-hover` variables. Disabled buttons are now outlined with grey text instead of faded, so their text keeps a 4.5:1 contrast in light and dark mode. `confirmAlert` doesn't change.
