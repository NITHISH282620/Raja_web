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
};

export default nextConfig;
