import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import imageDomains from "@/config/imageDomains";

const nextConfig: NextConfig = {
  images: {
    domains: imageDomains,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
