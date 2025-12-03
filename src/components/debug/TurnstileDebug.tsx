'use client';

import { useEffect, useState } from 'react';

/**
 * Temporary debug component to check Turnstile status
 * Add this to your page to see what's happening with Turnstile
 */
export function TurnstileDebug() {
  const [status, setStatus] = useState<{
    scriptLoaded: boolean;
    apiAvailable: boolean;
    siteKey: string | undefined;
    widgetElement: boolean;
  }>({
    scriptLoaded: false,
    apiAvailable: false,
    siteKey: undefined,
    widgetElement: false,
  });

  useEffect(() => {
    const checkStatus = () => {
      setStatus({
        scriptLoaded: !!(window as any).turnstile,
        apiAvailable: typeof (window as any).turnstile?.render === 'function',
        siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        widgetElement: !!document.getElementById('turnstile-widget'),
      });
    };

    // Check immediately
    checkStatus();

    // Check every second for 10 seconds
    const interval = setInterval(checkStatus, 1000);
    setTimeout(() => clearInterval(interval), 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-black p-4 text-xs text-white shadow-lg">
      <h3 className="mb-2 font-bold">Turnstile Debug</h3>
      <div className="space-y-1">
        <div>Script Loaded: {status.scriptLoaded ? '✅' : '❌'}</div>
        <div>API Available: {status.apiAvailable ? '✅' : '❌'}</div>
        <div>Site Key: {status.siteKey ? '✅ ' + status.siteKey.substring(0, 10) + '...' : '❌'}</div>
        <div>Widget Element: {status.widgetElement ? '✅' : '❌'}</div>
      </div>
      <button
        onClick={() => {
          console.log('=== TURNSTILE DEBUG ===');
          console.log('Window object has turnstile:', !!(window as any).turnstile);
          console.log('Turnstile API:', (window as any).turnstile);
          console.log('Site Key:', process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
          console.log('Widget element:', document.getElementById('turnstile-widget'));
          console.log('Token input:', document.getElementById('turnstileToken'));
          console.log('Token value:', (document.getElementById('turnstileToken') as HTMLInputElement)?.value);
        }}
        className="mt-2 w-full rounded bg-white px-2 py-1 text-black">
        Log to Console
      </button>
    </div>
  );
}
