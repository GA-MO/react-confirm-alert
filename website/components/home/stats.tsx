import type { HomeStats } from '@/lib/home-stats'

// Each number names where it comes from; a number the build could not read is left out.
export function Stats({ stats, className = '' }: { stats: HomeStats, className?: string }) {
  const items = [
    stats.downloads !== null && { value: stats.downloads.toLocaleString('en-US'), label: 'downloads last month', source: 'npm', href: 'https://www.npmjs.com/package/react-confirm-alert' },
    stats.gzip !== null && { value: `${(stats.gzip / 1000).toFixed(1)} kB`, label: 'gzip for confirm()', source: 'size-limit', href: 'https://github.com/GA-MO/react-confirm-alert/blob/master/.size-limit.json' },
    { value: String(stats.dependencies), label: stats.dependencies === 1 ? 'dependency' : 'dependencies', source: 'package.json', href: 'https://github.com/GA-MO/react-confirm-alert/blob/master/package.json' },
  ].filter((item) => item !== false)
  return (
    <dl className={`grid grid-cols-3 gap-4 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5">
          <dt className="sr-only">{item.label}</dt>
          <dd className="text-2xl font-semibold tabular-nums tracking-tight text-fd-foreground">{item.value}</dd>
          <dd className="text-xs text-fd-muted-foreground">
            {item.label} · <a href={item.href} className="underline decoration-fd-border underline-offset-2 transition-colors hover:text-fd-foreground hover:decoration-current">{item.source}</a>
          </dd>
        </div>
      ))}
    </dl>
  )
}
