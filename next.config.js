/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/:section(recipes|celebrations|why-us|faq|book|reservation)',
        destination: '/',
      },
    ];
  },
};

module.exports = nextConfig;
