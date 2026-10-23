import { defineConfig, type Plugin } from 'vite'

// CJS keeps v3's path (lib/index.js) for `main`. ESM is a .js file read through `module`,
// because the package has no "type" field and no exports map until 4.0.0. A nested
// dist/package.json marks that one folder as ESM so tools that follow Node's rules agree.
function markDistAsModule(): Plugin {
  return {
    name: 'mark-dist-as-module',
    generateBundle(options) {
      if (options.format !== 'es') return
      this.emitFile({ type: 'asset', fileName: 'dist/package.json', source: '{ "type": "module" }\n' })
    }
  }
}

export default defineConfig({
  plugins: [markDistAsModule()],
  publicDir: false,
  build: {
    outDir: '.',
    emptyOutDir: false,
    // webpack 4's parser stops at ES2019 syntax (no class fields or static blocks), and v3 shipped ES5.
    target: 'es2018',
    minify: false,
    sourcemap: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'dist/index.esm.js' : 'lib/index.js')
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      output: {
        banner: "'use client';",
        exports: 'named'
      }
    }
  }
})
