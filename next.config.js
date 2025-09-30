/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true }, // uncomment only if we decide to bypass TS during MVP
  
  // Image domains for external images
  images: {
    domains: [
      'localhost',
      'coinads.com',
      'app.coinads.com',
      // Add CDN domains for creative assets if needed
    ],
  },
  
  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://coinads.com https://app.coinads.com https://*.coinads.com https://vitals.vercel-insights.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
  
  // Redirects and rewrites
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.coinads.com',
          },
        ],
        destination: 'https://coinads.com/:path*',
        permanent: true,
      },
    ];
  },
  
  // Rewrites for subdomain split (if enabled)
  async rewrites() {
    const useSubdomain = process.env.NEXT_PUBLIC_APP_SUBDOMAIN === 'true';
    
    if (useSubdomain) {
      return [
        // Rewrite /app/* to app subdomain when subdomain split is enabled
        {
          source: '/app/:path*',
          destination: 'https://app.coinads.com/:path*',
        },
      ];
    }
    
    return [];
  },
};
module.exports = nextConfig;
