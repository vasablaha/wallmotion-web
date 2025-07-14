import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env: {
    // Stripe (public a server-side)
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    
    // AWS Cognito (s _AWS suffix pro Amplify)
    REGION_AWS: process.env.REGION_AWS,
    USER_POOL_ID_AWS: process.env.USER_POOL_ID_AWS,
    USER_POOL_CLIENT_ID_AWS: process.env.USER_POOL_CLIENT_ID_AWS,
    ACCESS_KEY_ID_AWS: process.env.ACCESS_KEY_ID_AWS,
    SECRET_ACCESS_KEY_AWS: process.env.SECRET_ACCESS_KEY_AWS,
    
    // MongoDB
    MONGODB_URI: process.env.MONGODB_URI,
    
    // App Configuration
    DOWNLOAD_URL: process.env.DOWNLOAD_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

export default nextConfig