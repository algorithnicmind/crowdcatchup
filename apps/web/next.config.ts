import type { NextConfig } from 'next';
// @ts-expect-error: next-pwa missing types
import withPWAInit from '@ducanh2912/next-pwa';
import { withReticle } from '@reticlehq/next';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default withReticle(withPWA(nextConfig));
