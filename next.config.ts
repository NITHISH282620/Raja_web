import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next 16 requires this allowlist — an unlisted `quality` prop is silently
     * snapped to the nearest allowed value. 90 is the hero poster and the
     * full-bleed case-study images; 75 stays the default for everything else.
     */
    qualities: [60, 75, 90],
    formats: ["image/avif", "image/webp"],
  },

  /**
   * `/portfolio` moved to `/projects`: "projects" is the word this industry and
   * its tender documents actually use. Permanent, because the old path was
   * live and linked.
   */
  async redirects() {
    return [{ source: "/portfolio", destination: "/projects", permanent: true }];
  },
};

export default nextConfig;
