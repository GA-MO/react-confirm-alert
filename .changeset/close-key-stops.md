---
'react-confirm-alert': patch
---

Closing a dialog from `onkeyPress` or `onKeyDown` on Enter no longer clicks the button that opened it, so the dialog doesn't open again in Chromium (#84).
