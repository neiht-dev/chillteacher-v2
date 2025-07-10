import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	output: 'standalone',

	// Nginx will do gzip compression. We disable
	// compression here so we can prevent buffering
	// streaming responses
	compress: false,
	// Optional: override the default (1 year) `stale-while-revalidate`
	// header time for static pages
	// swrDelta: 3600 // seconds
};

export default nextConfig;
