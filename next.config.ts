import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:lang(en|hi)/about",
        destination: "/:lang/contact",
        permanent: true,
      },
    ];
  },
  outputFileTracingRoot: process.cwd(),
};
export default nextConfig;
