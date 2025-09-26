/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true }, // uncomment only if we decide to bypass TS during MVP
};
module.exports = nextConfig;
