'use client';

import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import React, {useState} from 'react';
import Link from 'next/link';
import {
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
import {Button} from '@/components/ui/button';
import {ArrowRightCircle, CircleArrowRight} from 'lucide-react';


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
      <div className={'relative mx-auto flex justify-center w-full max-w-9xl lg:px-8'}>
      <div className="relative flex w-full bg-white md:rounded-lg items-center justify-between shadow-md px-6 py-4">
        <div className="flex flex-0">
          <div className="relative z-40">
            <Link href="/">
              <span className="sr-only">{settings.site_name}</span>
              <PrismicImage
                field={settings.logo}
                className={cn(
                  'inline w-full !max-w-[150px] origin-left',
                )}

              />
            </Link>
          </div>
        </div>
        <div className="self-end grid grid-cols-2 gap-2 lg:hidden">
          <NavigationMobileMenu navigation={navigation} logo={settings.footer_logo} siteName={settings.site_name} />
        </div>
        <div className={'hidden lg:flex item-center justify-center'}>
        <NavigationMenu>
          <NavigationMenuList>
            {navigation?.navigation_items.map((item: NavigationBarDocumentDataNavigationItemsItem, idx) => {
              const navigationItem = item.navigation_item as unknown as NavigationElementDocument | NavigationMegaMenuItemDocument;
              if (navigationItem.type === 'navigation_element') {
                return navigationItem.data?.subs[0]?.label !== null ? (
                    <NavigationMenuItem key={`main-nav-${idx}`}>
                      <NavigationMenuTrigger  className={'text-lg'}>
                        <PrismicNextLink field={navigationItem.data.link}>{navigationItem.data.label}</PrismicNextLink> </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuSubItem item={navigationItem.data}/>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                ) : (
                    <NavigationMenuItem key={`main-nav-${idx}`}>
                      <PrismicNextLink field={navigationItem.data.link} passHref legacyBehavior>
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), '!text-lg font-bold')}>
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
                        <div className={'flex flex-row gap-5 p-10'}>
                        <SliceZone slices={navigationItem.data.slices} components={components} context={{subs: navigationItem.data.subs}}/>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                ) : (
                    <NavigationMenuItem key={`main-nav-${idx}`}>
                      <PrismicNextLink field={navigationItem.data.link} passHref legacyBehavior>
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), '!text-lg font-bold')}>
                          {navigationItem.data.link}
                        </NavigationMenuLink>
                      </PrismicNextLink>
                    </NavigationMenuItem>
                );
              }

            })}
          </NavigationMenuList>
        </NavigationMenu>
        </div>
        <div className="relative z-40 hidden lg:flex lg:flex-shrink lg:justify-end space-x-2">
          <SearchButton />
          <Button variant={'default'} size={'sm'} className={'bg-accent'}>Book now <CircleArrowRight className={'h-5 w-5'} /> </Button>
        </div>
      </div>
      </div>
    </motion.header>
  );
}
