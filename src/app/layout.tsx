import '@/styles/globals.css';
import {GeistSans} from "geist/font/sans";
import { type Metadata, type ResolvingMetadata } from 'next';
import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';
import CookieConsent from '@/components/features/cookie-consent/cookie-consent';
import { GoogleAnalytics } from '@next/third-parties/google';
import Footer from '@/components/layouts/footer';
import { createClient } from '@/prismicio';
import logo from '@/assets/logo.svg';
import NextTopLoader from 'nextjs-toploader';
import type { SocialLinkItemType } from '@/types/socialLinkItem.type';
import type { Cta, LinkPrismicType } from '@/types';
import NavigationMenuSub from '@/components/layouts/navigation/navigation-menu-sub';
import BackToTop from '@/components/ui/BackToTop';
import { Suspense } from 'react';
import { SearchProvider } from '@/components/features/search/search-context';
import { SearchOverlay } from '@/components/features/search/search-overlay';


type Props = {
  params: Promise<{ uid: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function isURL(string: string | null | undefined): boolean {
  if (!string) return false;

  const pattern = new RegExp('^(https?|ftp):\\/\\/[^s/$.?#].[^s]*$', 'i');
  return pattern.test(string);
}

export async function generateMetadata({}: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle('settings');
  const defaultImages = ['/share-img.png'];

  if (settings?.data.share_image?.url) {
    defaultImages[0] = settings?.data.share_image?.url;
  }

  return {
    metadataBase: new URL(
      isURL(settings.data?.canonical_url ?? '')
        ? settings.data.canonical_url!
        : (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://footfactor.com'),
    ),
    alternates: {
      canonical: settings.data?.canonical_url ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'https://footfactor.com',
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}feed.xml`,
      },
    },
    title: settings?.data.meta_title ?? (await parent).title ?? 'Bespoke Orthotics London | Biomechanics Analysis | Foot Factor UK',
    description: settings?.data.meta_description ?? (await parent).description,
    keywords: settings?.data.meta_keywords ?? (await parent).keywords ?? '',
    openGraph: {
      images: [...defaultImages],
    },
    icons: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        url: '/favicon-48x48.png',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/apple-touch-icon.png',
      },
    ],
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const client = createClient();
  const navigation = await client.getSingle('navigation_bar', {
    fetchLinks: [
      'navigation_element.label',
      'navigation_element.link',
      'navigation_element.subs',
      'navigation_element.cta',
      'navigation_element.icon',
      'navigation_mega_menu_item.subs',
      'navigation_mega_menu_item.label',
      'navigation_mega_menu_item.link',
      'navigation_mega_menu_item.icon',
      'navigation_mega_menu_item.slices'
    ],
  });
  const settings = await client.getSingle('settings');



  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={'min-h-screen text-gray-950 antialiased'}>
        {/* Loading-bar */}
        <NextTopLoader color={'hsl(var(--accent))'} height={5} showSpinner={false} shadow={false} zIndex={99999} />

        <SearchProvider>
          <NavigationMenuSub navigation={navigation.data} settings={settings.data} />

          {/* Content */}

          {children}

          {/* Footer consent */}
          <Footer
            navigation={navigation.data}
            settings={settings.data }
          />

          {/* Cookie consent */}
          <Suspense>
            <CookieConsent />
            <BackToTop />
          </Suspense>

          <PrismicPreview repositoryName={repositoryName} />

          <SearchOverlay />
        </SearchProvider>
      </body>

      {/* Analytics */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? ''} />
    </html>
  );
}
