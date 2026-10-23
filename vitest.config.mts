import { defineConfig } from 'vite'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('./', import.meta.url))

// Playwright's Firefox cannot launch on some macOS versions ("Could not find profile folder"),
// so a machine can narrow the list, e.g. VITEST_BROWSERS=chromium,webkit. CI runs all three.
// RCA_TARGET=build runs the same tests against the built ESM file instead of the source.
const entry = process.env.RCA_TARGET === 'build' ? 'dist/index.esm.js' : 'src/index.ts'

const browsers = (process.env.VITEST_BROWSERS ?? 'chromium,firefox,webkit').split(',')

export default defineConfig({
  define: { __RCA_ENTRY__: JSON.stringify(entry) },
  resolve: {
    alias: [
      { find: /^react-confirm-alert$/, replacement: `${root}${entry}` },
      { find: /^react-confirm-alert\/(.*)$/, replacement: `${root}$1` }
    ]
  },
  optimizeDeps: {
    include: ['react', 'react/jsx-dev-runtime', 'react/jsx-runtime', 'react-dom', 'react-dom/client']
  },
  test: {
    include: ['test/**/*.test.{ts,tsx}'],
    setupFiles: process.env.RCA_NO_SHOWMODAL ? ['test/setup-no-showmodal.ts'] : [],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      commands: {
        // Playwright's media emulation, for prefers-reduced-motion.
        emulateReducedMotion: async (ctx: any, value: 'reduce' | 'no-preference') => {
          await ctx.page.emulateMedia({ reducedMotion: value })
        }
      },
      instances: browsers.map((browser) => ({ browser: browser as 'chromium' | 'firefox' | 'webkit' }))
    }
  }
})
