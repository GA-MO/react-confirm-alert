// Builds the library at the repo root and installs its packed tarball here, the way users get it.
// A workspace link would load the root's React 18 next to this site's React 19.
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const site = fileURLToPath(new URL('..', import.meta.url))
const root = join(site, '..')
const run = (args, cwd) => execFileSync('npm', args, { cwd, stdio: 'inherit' })

run(['run', 'build'], root)
mkdirSync(join(site, '.pack'), { recursive: true })
const tarball = execFileSync('npm', ['pack', '--pack-destination', join(site, '.pack')], { cwd: root }).toString().trim().split('\n').pop()
copyFileSync(join(site, '.pack', tarball), join(site, '.pack', 'react-confirm-alert.tgz'))
rmSync(join(site, 'node_modules', 'react-confirm-alert'), { recursive: true, force: true })
run(['install', '--no-audit', '--no-fund'], site)

// The home page shows these numbers, so they always come from this build.
const sizes = JSON.parse(execFileSync('npx', ['size-limit', '--json'], { cwd: root }).toString())
writeFileSync(join(site, 'size.json'), JSON.stringify(sizes.map(({ name, size }) => ({ name, size })), null, 2))
