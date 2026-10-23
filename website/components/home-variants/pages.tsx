import { homeStats } from '@/lib/home-stats'
import { HomeA } from './variant-a'
import { HomeB } from './variant-b'

// Server pages: the stats are read once, when the site builds.
export async function HomeVariantA() {
  return <HomeA stats={await homeStats()} />
}

export async function HomeVariantB() {
  return <HomeB stats={await homeStats()} />
}
