'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getCookieConsentValue } from 'react-cookie-consent';
import { trackingConfig } from '@/lib/tracking/config.tracking';
import { grantConsentForEverything } from '@/lib/tracking/utils.tracking';



// Small helper with proper types (no `any`, no implied eval)
type IdleHandle = number;
const scheduleIdle = (cb: () => void): IdleHandle => {
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        // Wrap to give us a () => void signature
        return window.requestIdleCallback(() => cb());
    }
    return window.setTimeout(cb, 500);
};

const cancelIdle = (h: IdleHandle) => {
    if (typeof window !== 'undefined' && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(h);
    } else {
        clearTimeout(h);
    }
};

// Local, typed gtag wrapper to avoid ts-ignore
const gtag = (...args: unknown[]) => {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(args);
};

export function GoogleTagManager() {
    const [consented, setConsented] = useState(false);
    const [readyToLoad, setReadyToLoad] = useState(false);

    // Read stored consent on mount
    useEffect(() => {
        const val = getCookieConsentValue(trackingConfig.cookieBannerCookieName);
        setConsented(val === 'true');
    }, []);

    // After consent, schedule loading during idle (keeps LCP clean)
    useEffect(() => {
        if (!consented) return;
        const handle = scheduleIdle(() => setReadyToLoad(true));
        return () => cancelIdle(handle);
    }, [consented]);

    return (
        <>
            {readyToLoad && (
                <>
                    <Script
                        id="gtm"
                        strategy="lazyOnload"
                        src={`https://www.googletagmanager.com/gtm.js?id=${trackingConfig.gtmId}`}
                        onLoad={() => {
                            // Flip consent to granted once GTM is ready
                            gtag('consent', 'update', {
                                ad_storage: 'granted',
                                ad_user_data: 'granted',
                                ad_personalization: 'granted',
                                analytics_storage: 'granted',
                            });
                            // If you also track custom consent, keep this:
                            try {
                                grantConsentForEverything();
                            } catch {
                                // noop
                            }
                        }}
                    />
                    {/* Only render noscript when consented */}
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