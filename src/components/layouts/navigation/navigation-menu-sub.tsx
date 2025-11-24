'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  type NavigationBarDocumentData,
  type NavigationBarDocumentDataNavigationItemsItem,
  type NavigationElementDocument,
  type NavigationMegaMenuItemDocument,
  type SettingsDocumentData,
} from '@/prismic-types';
import { PrismicNextLink } from '@prismicio/next';
import { PrismicImage, SliceZone } from '@prismicio/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { NavigationMobileMenu } from '@/components/layouts/navigation/navigation-mobile-menu';
import cn from 'clsx';
import { SearchButton } from '@/components/features/search/search-button';
import { NavigationMenuSubItem } from '@/components/layouts/navigation/navigation-menu-sub-item';
import { components } from '@/slices';
import MakeBookingDialog from '@/components/features/make-booking/make-booking-dialog';
import { Button } from '@/components/ui/button';
import { PhoneIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const parentVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 1, y: '-10rem' },
};

interface NavigationSubProps {
  navigation: NavigationBarDocumentData;
  settings: SettingsDocumentData;
}

export default function NavigationMenuSub({ navigation, settings }: NavigationSubProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);

  function update(latest: number, prev: number): void {
    if (latest < prev) {
      setHidden(false);
    } else if (latest > 100 && latest > prev) {
      setHidden(true);
    }
  }

  useMotionValueEvent(scrollY, 'change', (latest: number) => {
    update(latest, prevScroll);
    setPrevScroll(latest);
  });

  return (
    <motion.header
      id={'navbar'}
      className="fixed top-0 z-40 w-screen md:mt-5 lg:mt-10"
      animate={hidden ? 'hidden' : 'visible'}
      variants={parentVariants}
      transition={{
        ease: [0.1, 0.25, 0.3, 1],
        duration: 0.6,
        staggerChildren: 0.05,
      }}>
      <div className={'mx-auto flex w-full max-w-[1792px] justify-center px-0 md:px-5'}>
        <div className="relative w-full border border-gray-200 border-opacity-40 bg-white px-3 py-2 sm:px-6 sm:py-4 md:rounded-lg">
          <div className="flex w-full items-center justify-between">
            <div className="flex grow-0 lg:hidden">
              <div className="relative z-40">
                <Link href="/">
                  <span className="sr-only">{settings.site_name}</span>
                  <PrismicImage
                    field={settings.logo}
                    className={cn('hidden w-full !max-w-[250px] origin-left sm:inline')}
                  />
                  <PrismicImage
                    field={settings.logo_alt}
                    className={cn('inline !max-h-[40px] w-full origin-left sm:hidden')}
                  />
                </Link>
              </div>
            </div>

            <div className="flex shrink justify-end lg:hidden">
              <div className="flex items-center gap-x-1">
                <MakeBookingDialog />
                <NavigationMobileMenu
                  navigation={navigation}
                  logo={settings.footer_logo}
                  siteName={settings.site_name}
                />
              </div>
            </div>

            <div className={'hidden w-full lg:flex'}>
              <NavigationMenu>
                <div className="flex flex-1">
                  <Link href="/" className={'w-full'}>
                    <span className="sr-only">{settings.site_name}</span>
                    <PrismicImage field={settings.logo} className={cn('inline w-full !max-w-[310px] origin-left')} />
                  </Link>
                </div>

                <NavigationMenuList>
                  {navigation?.navigation_items.map((item: NavigationBarDocumentDataNavigationItemsItem, idx) => {
                    const navigationItem = item.navigation_item as unknown as
                      | NavigationElementDocument
                      | NavigationMegaMenuItemDocument;
                    if (navigationItem.type === 'navigation_element') {
                      return navigationItem.data?.subs[0]?.label !== null ? (
                        <NavigationMenuItem key={`main-nav-${idx}`}>
                          <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle())}>
                            <PrismicNextLink field={navigationItem.data.link}>
                              {navigationItem.data.label}
                            </PrismicNextLink>{' '}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <NavigationMenuSubItem item={navigationItem.data} />
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ) : (
                        <NavigationMenuItem key={`main-nav-${idx}`}>
                          <PrismicNextLink
                            field={navigationItem.data.link}
                            passHref
                            className={cn(navigationMenuTriggerStyle())}>
                            {navigationItem.data.label}
                          </PrismicNextLink>
                        </NavigationMenuItem>
                      );
                    } else if (navigationItem.type === 'navigation_mega_menu_item') {
                      if (!navigationItem.data) {
                        return null;
                      }

                      return navigationItem.data?.link !== null ? (
                        <NavigationMenuItem key={`main-nav-${idx}`}>
                          <NavigationMenuTrigger className={'text-lg'}>
                            {navigationItem.data.label}
                          </NavigationMenuTrigger>

                          <NavigationMenuContent>
                            <div className={'flex h-full w-full flex-row gap-5 pt-10'}>
                              <SliceZone
                                slices={navigationItem.data.slices}
                                components={components}
                                context={{ subs: navigationItem.data.subs }}
                              />
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ) : (
                        <NavigationMenuItem key={`main-nav-${idx}`}>
                          <PrismicNextLink field={navigationItem.data.link} passHref legacyBehavior>
                            <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                              {navigationItem.data.link}
                            </NavigationMenuLink>
                          </PrismicNextLink>
                        </NavigationMenuItem>
                      );
                    }
                  })}
                </NavigationMenuList>
                <div className="relative z-40 hidden flex-1 items-center space-x-2 lg:flex lg:justify-end">
                  <SearchButton />
                  <div className="flex items-center" aria-label="Make a booking">
                    <MakeBookingDialog />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`tel:${settings.telephone}`}
                        className={'inline-block rounded-full bg-primary p-2 text-white'}>
                        <PhoneIcon size={'19'} />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{settings.telephone}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
