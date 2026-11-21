/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
  },
  async redirects() {
    return [
      { source: '/resume', destination: '/cv', permanent: false },
      { source: '/shoplon', destination: '/projects/shoplon', permanent: false },
      { source: '/magreach', destination: '/projects/magreach', permanent: false },
      { source: '/gamePlanet', destination: '/projects/gameplanet', permanent: false },
      { source: '/zinamatv', destination: '/projects/zinamatv', permanent: false },
      { source: '/rentta', destination: '/projects/rentta', permanent: false },
      { source: '/twitch', destination: '/projects/twitch', permanent: false },
    ];
  },
};

module.exports = nextConfig;
