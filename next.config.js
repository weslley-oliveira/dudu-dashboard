/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['formidable'],
  },
  images: {
    domains: ['alexandremotorcycles.s3.eu-north-1.amazonaws.com'],
  },
};

module.exports = nextConfig;
