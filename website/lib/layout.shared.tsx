import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { appName, gitConfig } from './shared'

export function baseOptions (): BaseLayoutProps {
  return {
    nav: { title: appName },
    links: [
      { text: 'Docs', url: '/docs' },
      { text: 'Playground', url: '/playground' }
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`
  }
}
