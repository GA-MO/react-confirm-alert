import { defineConfig, transformWithOxc, type Plugin } from 'vite'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath } from 'node:url'

const v3Source = /\/src\/index\.js(\?.*)?$/

function v3Jsx(): Plugin {
  return {
    name: 'v3-jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      if (!v3Source.test(id)) return null
      const result = await transformWithOxc(code, id.replace(v3Source, '/src/index.jsx'), {
        jsx: { runtime: 'classic' }
      })
      return { code: result.code, map: result.map }
    }
  }
}

const root = fileURLToPath(new URL('./', import.meta.url))

// Playwright's Firefox cannot launch on some macOS versions ("Could not find profile folder"),
// so a machine can narrow the list, e.g. VITEST_BROWSERS=chromium,webkit. CI runs all three.
const browsers = (process.env.VITEST_BROWSERS ?? 'chromium,firefox,webkit').split(',')

export default defineConfig({
  plugins: [v3Jsx()],
  resolve: {
    alias: [
      { find: /^react-confirm-alert$/, replacement: `${root}src/index.js` },
      { find: /^react-confirm-alert\/(.*)$/, replacement: `${root}$1` }
    ]
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'prop-types']
  },
  test: {
    include: ['test/**/*.test.{ts,tsx}'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: browsers.map((browser) => ({ browser: browser as 'chromium' | 'firefox' | 'webkit' }))
    }
  }
})
