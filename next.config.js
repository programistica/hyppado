/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "p16-sign-sg.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "p16-sign-va.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "p77-sign-sg.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "p19-sign.tiktokcdn-us.com",
      },
      {
        protocol: "https",
        hostname: "*.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "*.tiktokcdn-us.com",
      },
    ],
  },
  // Include XLSX data files in serverless function bundles
  outputFileTracingIncludes: {
    "/api/kalodata/videos": ["./app/data/kalodata/*.xlsx"],
    "/api/kalodata/products": ["./app/data/kalodata/*.xlsx"],
    "/api/kalodata/creators": ["./app/data/kalodata/*.xlsx"],
  },
};

module.exports = nextConfig;
