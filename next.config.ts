// ============================================================
// next.config.ts — Next.js configuration
// ============================================================

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // Sass config for variables/mixins
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

export default nextConfig;
