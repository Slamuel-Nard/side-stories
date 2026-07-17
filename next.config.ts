import type { NextConfig } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const chapterPhotoPattern = supabaseUrl
  ? (() => {
      const url = new URL(supabaseUrl)

      return {
        protocol: url.protocol.slice(0, -1) as 'http' | 'https',
        hostname: url.hostname,
        port: url.port,
        pathname: '/storage/v1/object/public/chapter-photos/**',
      }
    })()
  : null

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  images: {
    localPatterns: [
      {
        pathname: '/artifacts/**',
        search: '?v=20260714-rounded-cards',
      },
    ],
    remotePatterns: chapterPhotoPattern ? [chapterPhotoPattern] : [],
  },
}

export default nextConfig
