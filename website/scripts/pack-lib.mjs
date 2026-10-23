// Builds the library at the repo root and installs its packed tarball here, the way users get it.
// A workspace link would load the root's React 18 next to this site's React 19.
//
// The library is not a dependency in package.json, so package-lock.json never records a tarball
// integrity: a tarball packed on another machine (CI) has a different hash, and a recorded one
// either fails with EINTEGRITY or installs a stale copy. It is installed with --no-save instead.
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const site = fileURLToPath(new URL('..', import.meta.url))
const root = join(site, '..')
const run = (args, cwd) => execFileSync('npm', args, { cwd, stdio: 'inherit' })

run(['run', 'build'], root)
mkdirSync(join(site, '.pack'), { recursive: true })
const tarball = execFileSync('npm', ['pack', '--pack-destination', join(site, '.pack')], { cwd: root }).toString().trim().split('\n').pop()
copyFileSync(join(site, '.pack', tarball), join(site, '.pack', 'react-confirm-alert.tgz'))
run(['install', '--no-audit', '--no-fund'], site)
run(['install', '--no-save', '--no-audit', '--no-fund', './.pack/react-confirm-alert.tgz'], site)

// The home page shows the measured gzip size, so it reads size-limit's own output for the build it ships.
// --ignore-missing skips the v3 baseline entries, whose fixture is not installed here.
const sizes = execFileSync('npx', ['size-limit', '--json', '--ignore-missing'], { cwd: root }).toString()
writeFileSync(join(site, '.pack', 'size.json'), sizes)
