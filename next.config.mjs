import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // images: { unoptimized: true },
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback, // This spreads existing fallbacks
      'tfhe_bg.wasm': require.resolve('tfhe/tfhe_bg.wasm'),
    }
    return config
  },
}

export default nextConfig
