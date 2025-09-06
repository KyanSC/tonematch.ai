/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  optimizeFonts: true,
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // Force apex domain, drop www to avoid duplicate content
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.toneadapt.com' }],
        destination: 'https://toneadapt.com/:path*',
        permanent: true,
      },
      // Redirect old domain if needed
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'tonematch-ai.vercel.app' }],
        destination: 'https://toneadapt.com/:path*',
        permanent: true,
      },
    ]
  },
  images: { 
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
