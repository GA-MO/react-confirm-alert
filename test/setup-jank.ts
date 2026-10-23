// RCA_JANK=1 blocks the page main thread for VITE_JANK_MS (default 90) out of every 100 ms, so rendering, effects and
// timers run several times slower, the way they do on a busy CI runner.
setInterval(() => {
  const end = performance.now() + Number(import.meta.env.VITE_JANK_MS ?? 90)
  while (performance.now() < end) { /* busy */ }
}, 100)
