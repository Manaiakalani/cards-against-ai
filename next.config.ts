import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  ...(isGithubPages && {
    basePath: '/cards-against-sv',
    assetPrefix: '/cards-against-sv/',
  }),
};

export default nextConfig;
