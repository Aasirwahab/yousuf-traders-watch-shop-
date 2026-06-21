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
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
