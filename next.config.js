/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  }
}

module.exports = nextConfig
