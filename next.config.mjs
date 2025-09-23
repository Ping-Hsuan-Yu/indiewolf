/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/manga',
        destination: '/manga/2023',
        permanent: false
      },
      {
        source: '/illustration',
        destination: '/illustration/2025',
        permanent: false
      }
    ];
  }
};

export default nextConfig;
