/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

// Only use export mode in production builds
if (process.env.NODE_ENV === 'production' || process.env.NEXT_EXPORT === 'true') {
  nextConfig.output = 'export';
  nextConfig.distDir = 'out';
}

module.exports = nextConfig