'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getCookieConsentValue } from 'react-cookie-consent';
import { trackingConfig } from '@/lib/tracking/config.tracking';
// optional: keep if you want your helper to run too
import { grantConsentForEverything } from '@/lib/tracking/utils.tracking';

export function GoogleTagManager() {
    const [consented, setConsented] = useState(false);
    const [readyToLoad, setReadyToLoad] = useState(false);

    // 1) Read stored consent once client mounts
    useEffect(() => {
        const consent =
            getCookieConsentValue(trackingConfig.cookieBannerCookieName) === 'true';
        if (consent) setConsented(true);
    }, []);

    // 2) After consent, delay load to avoid competing with LCP
    useEffect(() => {
        if (!consented) return;
        const idle =
            ('requestIdleCallback' in window
                ? (window as any).requestIdleCallback
                : (cb: Function) => setTimeout(cb as any, 500)) as (cb: Function) => any;

        const id = idle(() => setReadyToLoad(true));
        return () => {
            if (typeof id === 'number') clearTimeout(id);
        };
    }, [consented]);

    return (
        <>
            {/* Consent Mode defaults BEFORE anything else */}
            <Script id="gtm-consent-defaults" strategy="beforeInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted'
          });
        `}
            </Script>

            {readyToLoad && (
                <>
                    {/* Load GTM lazily after we have consent */}
                    <Script
                        id="gtm"
                        strategy="lazyOnload"
                        src={`https://www.googletagmanager.com/gtm.js?id=${trackingConfig.gtmId}`}
                        onLoad={() => {
                            // Flip consent to granted after GTM is ready
                            // @ts-ignore
                            gtag('consent', 'update', {
                                ad_storage: 'granted',
                                ad_user_data: 'granted',
                                ad_personalization: 'granted',
                                analytics_storage: 'granted'
                            });
                            try { grantConsentForEverything(); } catch {}
                        }}
                    />
                    {/* Only render noscript iframe when consented */}
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${trackingConfig.gtmId}`}
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                </>
            )}
        </>
    );
}