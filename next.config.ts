import type { NextConfig } from 'next'

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development"
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  experimental: {
    dynamicIO: true,
    serverComponentsHmrCache: false,
  },
}

export default withPWA(nextConfig)
