import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Permite fotos hospedadas no Supabase Storage ou URLs externas */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
