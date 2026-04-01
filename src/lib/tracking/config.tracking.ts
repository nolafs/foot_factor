// src/libs/tracking/config.tracking.ts
'use client';

// Check if GTM is enabled via environment variable
export const IS_GTM_ENABLED =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID !== undefined && process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID !== '';

// Centralized tracking configuration
export const trackingConfig = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID ?? '',
  gaMeasurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '',
  cookieBannerCookieName: 'cookieConsent',
};
