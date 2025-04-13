'use client';

import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import React, {useState} from 'react';
import Link from 'next/link';
import {
  type MakeBookingDocumentData,
  type NavigationBarDocumentData,
  type NavigationBarDocumentDataNavigationItemsItem,
  type NavigationElementDocument, NavigationMegaMenuItemDocument, SettingsDocumentData,
} from '../../../../prismicio-types';
import { PrismicNextLink } from '@prismicio/next';
import {PrismicImage, SliceZone} from '@prismicio/react';
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
import {NavigationMenuSubItem} from '@/components/layouts/navigation/navigation-menu-sub-item';
import {components} from '@/slices';
import MakeBookingDialog from '@/components/features/make-booking/make-booking-dialog';


const parentVariants = {
  visible: {opacity: 1, y: 0},
  hidden: {opacity: 1, y: "-10rem"},
};

interface NavigationSubProps {
  navigation: NavigationBarDocumentData;
  settings: SettingsDocumentData;
}

export default function NavigationMenuSub({ navigation, settings }: NavigationSubProps) {

  const {scrollY} = useScroll();
  const [hidden, setHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);


  function update(latest: number, prev: number): void {
    if (latest < prev) {
      setHidden(false);
      console.log("visible");
    } else if (latest > 100 && latest > prev) {
      setHidden(true);
      console.log("hidden");
    }
  }

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    update(latest, prevScroll);
    setPrevScroll(latest);
  });


  return (
    <motion.header id={'navbar'}
                   className="fixed top-0 z-40 w-screen lg:mt-10"
                   animate={hidden ? "hidden" : "visible"}
                   variants={parentVariants}
                   transition={{
                     ease: [0.1, 0.25, 0.3, 1],
                     duration: 0.6,
                     staggerChildren: 0.05,
                   }}
    >
      <div className={'mx-auto flex justify-center w-full max-w-[1792px] px-5'}>
      <div className="relative w-full bg-white md:rounded-lg  border border-gray-200 border-opacity-40 px-6 py-4">
        <div className="flex w-full items-center justify-between">

          <div className="flex grow-0 lg:hidden">
            <div className="relative z-40">
              <Link href="/">
                <span className="sr-only">{settings.site_name}</span>
                <PrismicImage
                    field={settings.logo}
                    className={cn(
                        'inline w-full !max-w-[250px] origin-left',
                    )}

                />
              </Link>
            </div>
          </div>

          <div className="flex justify-end shrink  lg:hidden">
          <div className="flex items-center gap-x-2">
            <MakeBookingDialog />
            <NavigationMobileMenu navigation={navigation} logo={settings.footer_logo} siteName={settings.site_name} />
          </div>
          </div>


          <div className={'hidden lg:flex w-full'}>
                  <NavigationMenu>

                    <div className="flex flex-1">
                        <Link href="/" className={'w-full'}>
                          <span className="sr-only">{settings.site_name}</span>
                          <PrismicImage
                              field={settings.logo}
                              className={cn(
                                  'inline w-full !max-w-[310px] origin-left',
                              )}

                          />
                        </Link>
                    </div>

                    <NavigationMenuList>
                      {navigation?.navigation_items.map((item: NavigationBarDocumentDataNavigationItemsItem, idx) => {
                        const navigationItem = item.navigation_item as unknown as NavigationElementDocument | NavigationMegaMenuItemDocument;
                        if (navigationItem.type === 'navigation_element') {
                          return navigationItem.data?.subs[0]?.label !== null ? (
                              <NavigationMenuItem key={`main-nav-${idx}`}>
                                <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle())}>
                                  <PrismicNextLink field={navigationItem.data.link}>{navigationItem.data.label}</PrismicNextLink> </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                  <NavigationMenuSubItem item={navigationItem.data}/>
                                </NavigationMenuContent>
                              </NavigationMenuItem>
                  ) : (
                      <NavigationMenuItem key={`main-nav-${idx}`}>
                        <PrismicNextLink field={navigationItem.data.link} passHref legacyBehavior>
                          <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                            {navigationItem.data.label}
                          </NavigationMenuLink>
                        </PrismicNextLink>
                      </NavigationMenuItem>
                  );
                } else if (navigationItem.type === 'navigation_mega_menu_item') {

                  if (!navigationItem.data) {
                    return null;
                  }

                  return navigationItem.data?.link !== null ? (
                      <NavigationMenuItem key={`main-nav-${idx}`}>
                        <NavigationMenuTrigger className={'text-lg'}>{navigationItem.data.label}</NavigationMenuTrigger>

                        <NavigationMenuContent>
                          <div className={'flex flex-row gap-5 pt-10 h-full w-full'}>
                          <SliceZone slices={navigationItem.data.slices} components={components} context={{subs: navigationItem.data.subs}}/>
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
            <div className="relative z-40 hidden lg:flex flex-1 lg:justify-end space-x-2">
              <SearchButton/>
              <MakeBookingDialog />

            </div>
          </NavigationMenu>
          </div>

      </div>
      </div>
      </div>
    </motion.header>
  );
}
