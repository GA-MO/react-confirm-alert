// Reads webpack's stats to prove the bundle used dist/index.esm.js (the module field), not lib/index.js.
const stats = require(require('path').resolve(process.argv[2]))
const names = []
const walk = (modules = []) => modules.forEach((m) => { names.push(m.name || ''); walk(m.modules) })
walk(stats.modules)
if (!names.some((n) => n.includes('react-confirm-alert/dist/index.esm.js'))) {
  console.error('expected webpack to bundle react-confirm-alert/dist/index.esm.js')
  process.exit(1)
}
console.log('webpack bundled the ESM build through the module field')
