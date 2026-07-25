import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The app zone moved from /app/* to /dashboard/*, so old links, bookmarks and
   * any auth emails already in the wild keep working.
   */
  async redirects() {
    return [
      { source: "/app", destination: "/dashboard", permanent: true },
      { source: "/app/daily", destination: "/dashboard", permanent: true },
      { source: "/app/:path*", destination: "/dashboard/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
