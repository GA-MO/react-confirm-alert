import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath: '/react-confirm-alert',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  turbopack: { root: import.meta.dirname }
}

export default withMDX(config)
