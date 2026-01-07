/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for pure client-side app
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
