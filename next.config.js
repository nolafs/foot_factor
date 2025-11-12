/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
	productionBrowserSourceMaps: true,
	images: {
		formats: ['image/webp', 'image/avif'],
        deviceSizes: [360, 640, 768, 1024, 1280],      // tighten to your breakpoints
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.prismic.io',
			},
		],
	},
};

export default config;
