import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Facts for the home page, read when the site builds. A fact that cannot be read is null and the page
// leaves it out, so it never shows a number nobody measured.
export interface HomeStats {
  /** npm downloads in the last 30 days, from api.npmjs.org */
  downloads: number | null
  /** gzip bytes of `import { confirm }`, from size-limit's output in .pack/size.json (scripts/pack-lib.mjs) */
  gzip: number | null
  /** runtime dependencies in the library's package.json */
  dependencies: number
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

async function downloads(): Promise<number | null> {
  try {
    const res = await fetch('https://api.npmjs.org/downloads/point/last-month/react-confirm-alert', { cache: 'force-cache' })
    const body: unknown = res.ok ? await res.json() : null
    return isRecord(body) && typeof body.downloads === 'number' ? body.downloads : null
  } catch {
    return null
  }
}

function gzip(): number | null {
  try {
    const entries: unknown = JSON.parse(readFileSync(join(process.cwd(), '.pack/size.json'), 'utf8'))
    const entry = Array.isArray(entries) ? entries.find((e) => isRecord(e) && e.name === 'import { confirm } (ESM)') : null
    return isRecord(entry) && typeof entry.size === 'number' ? entry.size : null
  } catch {
    return null
  }
}

function dependencies(): number {
  const pkg: unknown = JSON.parse(readFileSync(join(process.cwd(), '../package.json'), 'utf8'))
  return isRecord(pkg) && isRecord(pkg.dependencies) ? Object.keys(pkg.dependencies).length : 0
}

export async function homeStats(): Promise<HomeStats> {
  return { downloads: await downloads(), gzip: gzip(), dependencies: dependencies() }
}
