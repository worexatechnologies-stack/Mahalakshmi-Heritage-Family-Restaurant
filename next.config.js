/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: process.env.npm_lifecycle_event === "dev" ? ".next-dev" : ".next",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      level: "error",
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:section(recipes|celebrations|why-us|faq|book|reservation)",
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
