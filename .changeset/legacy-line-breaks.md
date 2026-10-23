---
'react-confirm-alert': patch
---

`confirmAlert({ message: 'a\nb' })` keeps the line break, as `confirm` already does (#38).
