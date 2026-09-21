/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.fontecmobiles.com',
      },
      {
        protocol: 'https',
        hostname: 'fontecmobiles.com',
      },
      // keep this too if fontec.local is still used anywhere (e.g. staging)
      {
        protocol: 'https',
        hostname: 'fontec.local',
      },
    ],
  },
};

module.exports = nextConfig;