/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // PWA Configuration
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  },
  
  // Image Optimization
  images: {
    domains: ['localhost', 'portfoliobycomet.vercel.app'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental Features
  experimental: {
    appDir: false,
    serverComponentsExternalPackages: ['three']
  },
  
  // Headers for Security
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
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/admin',
        permanent: true,
      },
    ]
  },
  
  // Webpack Configuration
  webpack: (config) => {
    // Handle Three.js
    config.externals.push({
      'three': 'three'
    })
    
    return config
  },
  
  // Environment Variables
  env: {
    PORTFOLIO_VERSION: '1.0.0',
    BUILD_TIME: new Date().toISOString(),
  },
}

module.exports = nextConfig