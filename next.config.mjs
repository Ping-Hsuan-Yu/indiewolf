import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
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
      'class-variance-authority',
    ],
    serverActions: {
      // SEC-3: per-file size/type is enforced in uploadToCloudinary (15MB/file).
      // This bounds the whole request; batch uploads send all selected files at once,
      // so it must stay well above one file. 100mb (was 500mb) cuts the DoS surface
      // while keeping multi-image batches working — lower further if real batches are small.
      bodySizeLimit: '100mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/:locale(zh|en)/manga',
        destination: '/:locale/manga/ongoing',
        permanent: false,
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

export default withNextIntl(nextConfig)
