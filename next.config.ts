import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	images: {
		formats: ["image/avif", "image/webp"],
		minimumCacheTTL: 60 * 60 * 24 * 30,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.public.blob.vercel-storage.com",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
		],
	},
	turbopack: {
		root: __dirname,
	},
};

export default nextConfig;
