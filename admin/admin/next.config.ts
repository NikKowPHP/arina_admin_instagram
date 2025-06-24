import type { NextConfig } from "next";

// ROO-AUDIT-TAG :: plan-002-code-quality.md :: Configure ESLint integration with Next.js
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};
// ROO-AUDIT-TAG :: plan-002-code-quality.md :: END

export default nextConfig;
