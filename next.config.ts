import type { NextConfig } from "next";

// Lets next/image serve images uploaded from /admin to Supabase Storage.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl}/storage/v1/object/public/**`)] : [],
  },
  // The static design-system styleguide (public/styleguide/index.html) keeps its old URL.
  async rewrites() {
    return [{ source: "/styleguide", destination: "/styleguide/index.html" }];
  },
};

export default nextConfig;
