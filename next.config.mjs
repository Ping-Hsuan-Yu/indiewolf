import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
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
    ]
  }
}

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

export default withNextIntl(nextConfig)
