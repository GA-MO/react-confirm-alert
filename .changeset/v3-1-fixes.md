---
"react-confirm-alert": patch
---

Fix the blur that showed only on the first open (#77), the createRoot error when opening a dialog while one is open (#82), dialogs closing when a press starts inside and ends outside (#92), focus that stayed behind the dialog (#29), dialogs hidden under z-index 1050 with `modal: true` (#31), and the missing prop-types dependency that broke Vite (#85). react-dom's peer range is now >=18 (#88).
