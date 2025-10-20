/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    NEXT_PUBLIC_USDC_MINT: process.env.NEXT_PUBLIC_USDC_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'phantom.app' },
      { protocol: 'https', hostname: 'solflare.com' },
      { protocol: 'https', hostname: 'backpack.app' },
      { protocol: 'https', hostname: 'www.google.com' },
    ],
  },
  outputFileTracingRoot: '/Users/sol/USDC12x',
}

module.exports = nextConfig
