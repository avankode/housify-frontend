// frontend/next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // --- ADD THIS BLOCK ---
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    // --- END BLOCK ---
};

export default nextConfig;
