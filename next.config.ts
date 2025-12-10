import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    mcpServer: true,
  },
};

export default withWorkflow(nextConfig);
