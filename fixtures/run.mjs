// Packs the library, installs the tarball into each fixture and runs that fixture's `check` script.
// Usage: node fixtures/run.mjs [fixture ...]   (FIXTURE_PORT sets the port for browser checks)
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))
const root = join(here, '..')
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit', env: process.env })

const all = readdirSync(here, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(here, d.name, 'package.json')) && d.name !== 'v3-baseline')
  .map((d) => d.name)
const selected = process.argv.length > 2 ? process.argv.slice(2) : all

run('npm', ['run', 'build'], root)
mkdirSync(join(here, '.pack'), { recursive: true })
const tarball = execFileSync('npm', ['pack', '--pack-destination', join(here, '.pack')], { cwd: root })
  .toString().trim().split('\n').pop()
copyFileSync(join(here, '.pack', tarball), join(here, '.pack', 'react-confirm-alert.tgz'))

const failed = []
for (const name of selected) {
  const dir = join(here, name)
  console.log(`\n=== ${name} ===`)
  try {
    // npm skips a file: tarball whose version did not change, so drop the old copy first.
    rmSync(join(dir, 'node_modules', 'react-confirm-alert'), { recursive: true, force: true })
    run('npm', ['install', '--no-audit', '--no-fund', '--no-package-lock', '--install-links'], dir)
    run('npm', ['run', 'check'], dir)
    console.log(`PASS ${name}`)
  } catch {
    failed.push(name)
    console.log(`FAIL ${name}`)
  }
}
console.log(failed.length ? `\nFailed: ${failed.join(', ')}` : `\nAll ${selected.length} fixtures passed`)
process.exit(failed.length ? 1 : 0)
