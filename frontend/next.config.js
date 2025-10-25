/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Для Docker оптимизации
  experimental: {
    // serverActions: true, // Раскомментируйте если используете Server Actions
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:8000',
    API_URL: process.env.API_URL || 'http://localhost:8000'
  },
}

module.exports = nextConfig

