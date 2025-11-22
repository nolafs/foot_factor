'use client'

import {IS_GTM_ENABLED} from '@/lib/tracking/config.tracking';
import { type ReactNode, useEffect, useState } from 'react';
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent';
import {motion} from 'framer-motion'
import {trackingConfig} from '@/lib/tracking/config.tracking';
import {grantConsentForEverything, revokeConsentForEverything} from '@/lib/tracking/utils.tracking';
import Link from 'next/link';

import { GoogleAnalytics } from '@/components/features/tracking/GoogleAnalytics';

export const RootInnerLayout = ({children}: { children: ReactNode }) => {

  const [consent, setConsent] = useState(false);

  // Hydrate from cookie on mount so refresh / revisit works
  useEffect(() => {
    const val = getCookieConsentValue(trackingConfig.cookieBannerCookieName);
    setConsent(val === 'true');
  }, []);




  return (
    <>
      {/* GTM only cares whether consent is granted */}


      {children}
      {IS_GTM_ENABLED && <>
      <GoogleAnalytics consented={consent} />
      <motion.div
        initial={{ y: '100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="fixed inset-x-0 bottom-0 z-50"
      >
        <CookieConsent
          disableStyles={true}
          cookieName={trackingConfig.cookieBannerCookieName}
          buttonText="Accept All"
          location="bottom"
          declineButtonText="Decline"
          enableDeclineButton={true}
          declineButtonClasses="px-8 py-1.5 mr-2 text-lg inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition bg-white text-black hover:bg-white/90 transition-colors ease-in-out duration-100"
          containerClasses="w-full px-6 py-4 bg-black text-white text-center flex justify-center items-center flex-wrap shadow gap-3 md:gap-8 md:rounded-t-xl shadow"
          buttonClasses="px-8 py-1.5 text-lg inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition bg-accent text-white hover:bg-white/90 transition-colors ease-in-out duration-100"
          onAccept={() => {
            // 1) flip state for GTM
            setConsent(true);
            // 2) run your tracking util (see next section – make it “safe”)
            grantConsentForEverything();
          }}
          onDecline={() => {
            setConsent(false);
            revokeConsentForEverything();
          }}
        >
          <p>
            We use cookies for better user experience and site analytics. By continuing, you agree to our use of
            cookies. Learn more in our{' '}
            <Link href="/legal/privacy-policy-for-foot-factor" className="font-bold text-sky-400">
              Privacy Policy
            </Link>.
          </p>
        </CookieConsent>
      </motion.div>
       </> }
    </>
)}
