import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 纯静态导出：构建产物为 out/ 目录（HTML/JS/CSS），可托管到任意静态平台
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
