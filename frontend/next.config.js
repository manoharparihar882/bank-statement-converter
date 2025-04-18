/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*' // Proxy to Backend
      }
    ];
  },
  // For production, specify your custom domain if needed
  // basePath: '',
  // trailingSlash: false,
};

module.exports = nextConfig; 