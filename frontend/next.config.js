/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Для Docker оптимизации
  
  // Настройки для Hot Reload на Windows
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Проверять изменения каждую секунду
        aggregateTimeout: 300, // Задержка перед перезагрузкой
      }
    }
    return config
  },
  
  experimental: {
    // serverActions: true, // Раскомментируйте если используете Server Actions
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:8000',
    API_URL: process.env.API_URL || 'http://localhost:8000'
  },
}

module.exports = nextConfig

