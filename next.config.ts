import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  
  // Render's static site target expects a folder named `out` to exist after the
  // build step completes. Next.js normally outputs to `.next`, so we customise
  // the distribution directory to ensure the build artefacts end up in `out`.
  // This keeps the application behaviour identical while satisfying the
  // hosting requirement without introducing an additional export step.
  distDir: "out",
};

export default nextConfig;
