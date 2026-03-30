import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Empty turbopack config — silences the "webpack config without turbopack config" warning
  // better-sqlite3 works without special config when routes declare `runtime = 'nodejs'`
  turbopack: {},

  // Keep webpack config for non-Turbopack builds (e.g. `next build --webpack`)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent bundling of native Node.js modules — better-sqlite3 requires Node.js runtime
      const existingExternals = config.externals ?? [];
      if (Array.isArray(existingExternals)) {
        config.externals = [...existingExternals, 'better-sqlite3'];
      } else {
        config.externals = [existingExternals, 'better-sqlite3'];
      }
    }
    return config;
  },
};

export default nextConfig;
