/** @type {import('next').NextConfig} */

const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  //output: 'export',
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // pageDataCollectionTimeout: 5000,
  staticPageGenerationTimeout: 1000,
  transpilePackages: ['@mui/x-charts'],
  webpack: (config, { isServer }) => {
    
    // If client-side, don't polyfill `fs`
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
}

module.exports = nextConfig;