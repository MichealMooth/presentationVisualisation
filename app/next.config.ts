import type { NextConfig } from 'next'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const webpack = require('webpack')

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // pptxgenjs imports node: builtins — strip prefix so fallbacks work
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (result: { request: string }) => {
          result.request = result.request.replace(/^node:/, '')
        })
      )
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        http: false,
        https: false,
        url: false,
        stream: false,
        zlib: false,
      }
    }
    return config
  },
}

export default nextConfig
