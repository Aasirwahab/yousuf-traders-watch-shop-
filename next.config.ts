import type {NextConfig} from 'next';
import path from 'path';

const imageKitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      ...(imageKitEndpoint ? [new URL(`${imageKitEndpoint}/**`)] : []),
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Allow higher-quality optimized output for product photography (default is 75).
    qualities: [75, 90],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    // Baseline hardening applied to every route. The CSP is intentionally
    // conservative: it locks down clickjacking, <base> hijacking and plugins
    // without constraining script/connect sources, which would need Clerk's
    // frontend-API domain allow-listed and verified against the sign-in flow.
    const securityHeaders = [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {key: 'X-Content-Type-Options', value: 'nosniff'},
      {key: 'X-Frame-Options', value: 'DENY'},
      {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'Content-Security-Policy',
        value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests",
      },
    ];

    return [{source: '/:path*', headers: securityHeaders}];
  },
};

export default nextConfig;
