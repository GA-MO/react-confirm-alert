import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Playground } from '@/components/playground/playground'

export const metadata = { title: 'Playground' }

const dir = join(process.cwd(), 'components/custom-ui')
const sources = Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.tsx')).map((f) => [f.replace('.tsx', ''), readFileSync(join(dir, f), 'utf8')]))

export default function PlaygroundPage () {
  return <Playground sources={sources} />
}
