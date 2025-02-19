'use client'
import Link from 'next/link';
import { Bars3Icon } from '@heroicons/react/24/outline';
import {
  type NavigationBarDocumentData,
  type NavigationBarDocumentDataNavigationItemsItem,
  type NavigationElementDocument, NavigationMegaMenuItemDocument,
} from '../../../../prismicio-types';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {PrismicNextImage, PrismicNextLink} from '@prismicio/next';
import React, {ReactNode, useEffect, useState} from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SearchButton } from '@/components/features/search/search-button';
import {ImageField, KeyTextField, LinkField} from '@prismicio/client';
import {usePathname} from "next/navigation";
import cn from 'clsx';


interface NavigationSubProps {
  navigation: NavigationBarDocumentData;
  siteName?: KeyTextField | string;
  logo: ImageField;
}

const ButtonIcon = ({label, link, icon, children, classNames}: { label: KeyTextField | string, link?: LinkField, icon: ImageField, children?: ReactNode, classNames?: string}) => {
  const [active, setActive] = useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    if(link && 'url' in link){
      console.log('link',label,  path === link.url);
      setActive(prevState => path === link.url);
    }
  }, [link, path]);

  const linkContent = () => { return (
      <div className={cn('flex text-xl font-semibold text-white items-center gap-x-4 py-4 w-full pr-5', classNames)}>
        <span className={cn('w-6 h-4 rounded-r-full', active ? 'bg-white' : 'bg-transparent')}></span>
        <span className={'flex-grow-0'}>
      <PrismicNextImage field={icon} fallbackAlt={''}
                        className={'aspect-1 h-7 w-7 invert group-hover:inset-0 group-active:inset-0 '} width={100}
                        height={100}/>
    </span>
        <span className={'flex grow w-full justify-between'}>{label}{children}</span>
      </div>
  )}

  if(link) {
    return (
        <PrismicNextLink field={link} >
        {linkContent()}
        </PrismicNextLink>)

  } else {
    return (linkContent())
  }
}

export const NavigationMobileMenu = ({ logo, navigation, siteName}: NavigationSubProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <>
      <SearchButton />

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} >
        <SheetTrigger asChild>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90%] overflow-y-auto text-white bg-blue-950 px-0 py-6 shadow-none border-none">
          <SheetTitle>
            <div className="flex items-center justify-between px-5">
              <Link href="/public">
                <span className="sr-only">{siteName}</span>
                <PrismicNextImage field={logo} className="inline w-3/4"   />
              </Link>
            </div>
          </SheetTitle>
          <div className="mt-6 flow-root">
            {navigation?.navigation_items.map((item: NavigationBarDocumentDataNavigationItemsItem, idx) => {
              const navigationItem = item.navigation_item as unknown as NavigationElementDocument | NavigationMegaMenuItemDocument;
              return navigationItem.data?.subs[0]?.label !== null ? (
                  <div key={`main-mobile-nav-${idx}`}>
                    <Collapsible>
                      <CollapsibleTrigger className={'group w-full'}>
                        <ButtonIcon label={navigationItem.data.label} icon={navigationItem.data.icon}>
                          <ChevronDownIcon
                              aria-hidden="true"
                              className="size-5 flex-none group-data-[open]:rotate-180"
                          />
                        </ButtonIcon>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className={'flex flex-col space-y-5 py-5 pl-16'}>
                          {navigationItem.data?.subs?.map(item => (
                              <PrismicNextLink
                                  key={`main-mobile-nav-${item.label}}`}
                                  field={item.link}

                                  className="block text-base font-semibold text-white">
                                {item.label}
                              </PrismicNextLink>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
              ) : (

                  <ButtonIcon key={`main-mobile-nav-${idx}`} link={navigationItem.data.link}
                              label={navigationItem.data.label} icon={navigationItem.data.icon}/>

              );
            })}
            <div className="w-full border-t mt-10 border-gray-300/20"/>

            <div className={'flex flex-col mt-10 py-5'}>
              {navigation.cta_links.map((item, idx) => {
                return (
                    <ButtonIcon key={`main-mobile-cta-nav-${idx}`} link={item.link}
                                label={item.link?.text || ''} icon={item.icon}
                                classNames={'!text-base opacity-60 !py-2'}/>
                )
              })}
            </div>

          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
