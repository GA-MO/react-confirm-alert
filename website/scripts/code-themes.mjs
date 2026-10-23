// Writes lib/code-themes.json: vitesse light and dark with every token colour at WCAG AA (4.5:1)
// or better against the code block background, and prints each theme's lowest ratio.
// Run after changing a background: node scripts/code-themes.mjs
import { writeFileSync } from 'node:fs'
import light from '@shikijs/themes/vitesse-light'
import dark from '@shikijs/themes/vitesse-dark'

const AA = 4.5
// Code surfaces: white on the light grey page, a raised grey on the dark page.
const surfaces = { light: '#ffffff', dark: '#1f1f23' }

const parse = (hex) => {
  const h = hex.replace('#', '')
  const n = (i) => parseInt(h.slice(i, i + 2), 16)
  return { rgb: [n(0), n(2), n(4)], alpha: h.length === 8 ? n(6) / 255 : 1 }
}
const toHex = (rgb) => '#' + rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t)

// Flatten alpha onto the surface, then step toward black (light) or white (dark) until AA.
function accessible (hex, surface, toward) {
  const { rgb, alpha } = parse(hex)
  const flat = mix(surface, rgb, alpha)
  let t = 0
  while (contrast(parse(toHex(mix(flat, toward, t))).rgb, surface) < AA) t += 0.01
  return toHex(mix(flat, toward, t))
}

function adapt (theme, scheme) {
  const surface = parse(surfaces[scheme]).rgb
  const toward = scheme === 'light' ? [0, 0, 0] : [255, 255, 255]
  const fix = (hex) => (typeof hex === 'string' && hex.startsWith('#') ? accessible(hex, surface, toward) : hex)
  const tokenColors = theme.tokenColors.map((t) => ({ ...t, settings: { ...t.settings, foreground: fix(t.settings.foreground) } }))
  const semanticTokenColors = Object.fromEntries(Object.entries(theme.semanticTokenColors ?? {}).map(([k, v]) => [k, typeof v === 'string' ? fix(v) : { ...v, foreground: fix(v.foreground) }]))
  const colors = { ...theme.colors, 'editor.background': surfaces[scheme], 'editor.foreground': fix(theme.colors['editor.foreground']) }
  const out = { ...theme, name: `${theme.name}-aa`, bg: surfaces[scheme], fg: colors['editor.foreground'], colors, tokenColors, semanticTokenColors }
  const ratios = tokenColors.map((t) => t.settings.foreground).filter(Boolean).map((c) => contrast(parse(c).rgb, surface))
  console.log(`${out.name} on ${surfaces[scheme]}: lowest token contrast ${Math.min(...ratios).toFixed(2)}:1 over ${ratios.length} colours`)
  return out
}

const themes = { light: adapt(light, 'light'), dark: adapt(dark, 'dark') }
writeFileSync(new URL('../lib/code-themes.json', import.meta.url), JSON.stringify(themes))
