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
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-label',
      '@radix-ui/react-separator',
      '@radix-ui/react-select',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-switch',
      '@radix-ui/react-tooltip',
      'class-variance-authority'
    ],
    serverActions: {
      bodySizeLimit: '10mb'
    }
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
