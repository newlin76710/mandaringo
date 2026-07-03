/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Source images are already pre-compressed and served at their intended
    // display size (see scripts/optimize-images note in README), so we skip
    // Vercel's on-demand Image Optimization entirely: it removes the
    // "Image Optimization" usage line item and avoids an extra /_next/image
    // request (and its own Edge Request) per image per breakpoint.
    unoptimized: true,
  },
};

export default nextConfig;
