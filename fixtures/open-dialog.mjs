// Serves a built fixture, clicks a button by its text and waits for the dialog text.
// Usage: node ../open-dialog.mjs <dir> <button text> <expected text>
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { extname, join, resolve } from 'node:path'

const [dir, buttonText, expected] = process.argv.slice(2)
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css' }
const base = resolve(dir)

const server = createServer(async (req, res) => {
  const path = join(base, decodeURIComponent(new URL(req.url, 'http://x').pathname))
  try {
    const body = await readFile(path.endsWith('/') ? join(path, 'index.html') : path)
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'text/html' }).end(body)
  } catch {
    res.writeHead(404).end()
  }
})
await new Promise((ok) => server.listen(Number(process.env.FIXTURE_PORT ?? 0), '127.0.0.1', ok))
const browser = await chromium.launch()
const errors = []
try {
  const page = await browser.newPage()
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  await page.getByRole('button', { name: buttonText }).click()
  await page.locator('.react-confirm-alert-overlay').getByText(expected).waitFor({ timeout: 5000 })
  const position = await page.locator('.react-confirm-alert-overlay').evaluate((el) => getComputedStyle(el).position)
  if (position !== 'fixed') throw new Error(`overlay position is ${position}, so the CSS did not load`)
  if (errors.length) throw new Error(errors.join('\n'))
  console.log(`dialog opened: "${expected}"`)
} finally {
  await browser.close()
  server.close()
}
