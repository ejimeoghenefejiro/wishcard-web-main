/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/start",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
