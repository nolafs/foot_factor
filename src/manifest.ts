import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Foot Factor',
        short_name: 'FootFactor',
        start_url: '/',            // must be within `scope`
        scope: '/',                // service worker must also cover this
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#9cbacf',
        icons: [
            { src: 'web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
    };
}