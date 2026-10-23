import { Home } from '@/components/home/home'
import { homeStats } from '@/lib/home-stats'

// The stats are read once, when the site builds.
export default async function HomePage () {
  return <Home stats={await homeStats()} />
}
