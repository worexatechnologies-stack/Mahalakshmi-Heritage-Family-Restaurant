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
  async rewrites() {
    return [
      {
        source: '/:section(home|about|menu|gallery|contact|recipes|celebrations|why-us|faq)',
        destination: '/',
      },
    ];
  },
};

module.exports = nextConfig;
