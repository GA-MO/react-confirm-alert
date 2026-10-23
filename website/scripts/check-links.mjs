// Fails when a page in out/ links to a path under the basePath that the export did not produce.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const out = new URL('../out/', import.meta.url).pathname
const base = '/react-confirm-alert'
const pages = []
const walk = (dir) => readdirSync(dir).forEach((f) => {
  const p = join(dir, f)
  if (statSync(p).isDirectory()) walk(p)
  else if (p.endsWith('.html')) pages.push(p)
})
walk(out)
const broken = []
for (const page of pages) {
  // Without an icon link, browsers ask for /favicon.ico at the domain root, outside the basePath,
  // and log a 404 on a visitor's first load.
  const icon = readFileSync(page, 'utf8').match(/<link rel="icon" href="([^"?]+)/)
  if (!page.endsWith('404.html') && (!icon || !icon[1].startsWith(`${base}/`) || !existsSync(join(out, icon[1].slice(base.length))))) {
    broken.push(`${page.slice(out.length)} -> missing icon under ${base}`)
  }
  for (const [, href] of readFileSync(page, 'utf8').matchAll(/href="([^"#?]+)/g)) {
    if (!href.startsWith(`${base}/`)) continue
    const path = join(out, href.slice(base.length))
    if (!existsSync(path) && !existsSync(join(path, 'index.html')) && !existsSync(`${path}.html`)) broken.push(`${page.slice(out.length)} -> ${href}`)
  }
}
console.log(`${pages.length} pages checked`)
if (broken.length) {
  console.error(broken.join('\n'))
  process.exit(1)
}
