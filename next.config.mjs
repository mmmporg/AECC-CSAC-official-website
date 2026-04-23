import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts')

const remotePatterns = [
  {
    protocol: 'https',
    hostname: '**.supabase.co',
    pathname: '/storage/v1/object/public/**'
  }
]

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const { hostname, protocol } = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)

    remotePatterns.push({
      hostname,
      pathname: '/storage/v1/object/public/**',
      protocol: protocol.replace(':', '')
    })
  } catch {
    // Ignore invalid env values during local bootstrap.
  }
}

const nextConfig = {
  compress: true,
  images: {
    remotePatterns,
    formats: ['image/avif', 'image/webp']
  }
}

export default withNextIntl(nextConfig)
