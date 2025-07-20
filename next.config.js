/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
	productionBrowserSourceMaps: true,
	images: {
		formats: ['image/webp', 'image/avif'], // modern formats preferred
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.prismic.io',
			},
		],
	},
};

export default config;
