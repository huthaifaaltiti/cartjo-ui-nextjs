import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import imageDomains from "@/config/imageDomains";

const nextConfig: NextConfig = {
  images: {
    domains: imageDomains,
  },
  async rewrites() {
    return [
      // 1. Primary Vanity Handle (e.g. cartjo.com/ar/@digital-library)
      {
        source: "/:locale/@:handle",
        destination: "/:locale/creators/:handle",
      },
      // 2. Store with @handle (e.g. cartjo.com/ar/store/@digital-library)
      {
        source: "/:locale/store/@:handle",
        destination: "/:locale/creators/:handle",
      },
      // 3. Store with clean handle or slug (e.g. cartjo.com/ar/store/digital-library)
      {
        source: "/:locale/store/:handle",
        destination: "/:locale/creators/:handle",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
