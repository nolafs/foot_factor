import '@/styles/globals.css';
import { Poppins, Exo_2, PT_Serif } from 'next/font/google';
import { type Metadata, type ResolvingMetadata } from 'next';
import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';
import CookieConsent from '@/components/features/cookie-consent/cookie-consent';
import { GoogleAnalytics } from '@next/third-parties/google';
import Footer from '@/components/layouts/footer';
import { createClient } from '@/prismicio';
import NextTopLoader from 'nextjs-toploader';
import NavigationMenuSub from '@/components/layouts/navigation/navigation-menu-sub';
import BackToTop from '@/components/ui/BackToTop';
import React, { Suspense } from 'react';
import { SearchProvider } from '@/components/features/search/search-context';
import { SearchOverlay } from '@/components/features/search/search-overlay';
import { BookingProvider } from '@/lib/context/booking.context';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
})

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo-2',
  weight: ['400', '500', '600', '700'],
});

const ptSerif = PT_Serif({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-pt-serif',
  weight: ['400'],
});

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
  const defaultImages = [];

  if (settings?.data.share_image?.url) {
    defaultImages[0] = settings?.data.share_image?.url;
  }

  return {
    metadataBase: new URL(
      isURL(settings.data?.canonical_url ?? '')
        ? settings.data.canonical_url!
        : (process.env.NEXT_PUBLIC_BASE_URL ?? 'https://footfactor.com'),
    ),
    alternates: {
      canonical: settings.data?.canonical_url ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'https://footfactor.com',
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}feed.xml`,
      },
    },
    title: settings?.data.meta_title ?? (await parent).title ?? 'Foot Factor UK',
    description: settings?.data.meta_description ?? (await parent).description,
    keywords: settings?.data.meta_keywords ?? (await parent).keywords ?? '',
    openGraph: {
      images: [...defaultImages],
    },
    verification: {
      other: {
        'algolia-site-verification': '3032BA6863E51546',
      }
    },
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
  const makeBooking = await client.getSingle('make_booking');



  return (
    <html lang="en" className={`${poppins.variable} ${exo2.variable} ${ptSerif.variable}`}>
      <body className={'min-h-screen text-gray-950 antialiased'}>
        {/* Loading-bar */}
        <NextTopLoader color={'hsl(var(--accent))'} height={5} showSpinner={false} shadow={false} zIndex={99999} />

        <SearchProvider>
          <BookingProvider initialData={makeBooking.data}>
          <NavigationMenuSub navigation={navigation.data} settings={settings.data}  />

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

          {/* Prismic preview */}
          <PrismicPreview repositoryName={repositoryName} />
          </BookingProvider>
          <SearchOverlay />
        </SearchProvider>
      </body>

      {/* Analytics */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? ''} />
    </html>
  );
}
