import type { Cta, NavigationProps, SocialLinkItemType } from '@/types';
import { PrismicNextLink } from '@prismicio/next';
import React from 'react';

import Link from 'next/link';

import SocialList from '../features/social-list/social-list';
import { Container } from '@/components/ui/container';
import type { NavigationBarDocumentData, NavigationElementDocument } from '../../../prismicio-types';
import { CallToAction } from '@/components/features/cta/callToAction';
import { BorderRow } from '@/components/ui/border-row';
import Image from 'next/image';
import {StaticImport} from 'next/dist/shared/lib/get-img-props';

export interface FooterProps {
  navigation: NavigationBarDocumentData;
  secondaryNavigation?: NavigationProps;
  social?: SocialLinkItemType[] | undefined;
  copyright: string | undefined | null;
  footerCta?: Cta | undefined;
  logo: StaticImport;
}

export function Footer({ navigation, footerCta, secondaryNavigation, social, copyright, logo }: FooterProps) {
  const copyRightDate = new Date().getFullYear();
  return (
    <footer>
      <div className="relative bg-[#2E5F9A] bg-gradient-to-b from-[#3f7bc6] from-10% via-[#2E5F9A] via-[60%] to-[#2E5F9A]">
        <div className="absolute inset-2 z-0 rounded-4xl border-transparent bg-white/5 shadow-md ring-1 ring-[#8fde5d]/15 after:absolute after:inset-0 after:rounded-4xl after:shadow-[inset_0_0_2px_1px_#ffffff4d]" />

        <Container className={'relative z-10 block pb-10'}>
          {footerCta && <CallToAction {...footerCta} dark={true} />}

          <div>
            <BorderRow>
              <div className="mt-10 grid grid-cols-2 gap-y-10 pb-10 lg:grid-cols-6 lg:gap-8">
                <div className="col-span-2 flex flex-col justify-between">
                  <Link href="/" className={'grow'}>
                    <h2 id="footer-heading" className="sr-only">
                      Foot Factor
                    </h2>
                    <Image src={logo} className="inline !max-w-[250px]"  alt="logo" />
                  </Link>
                  <div className={'mt-12 shrink'}>
                    {social && <SocialList items={social} icons={true} variantList={1} variantButton={3} />}
                  </div>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-12 lg:col-span-4 lg:grid-cols-subgrid">
                  {navigation?.navigation_items.map(item => {
                    const navigationItem = item.navigation_item as unknown as NavigationElementDocument;
                    return (
                      <div key={navigationItem.data.label}>
                        {navigationItem.data.subs[0]?.label ? (
                          <>
                            <div className={'mb-10'}>
                              <PrismicNextLink
                                field={navigationItem.data.link}
                                className="text-base font-medium text-white transition-all hover:text-white/80">
                                {navigationItem.data.label}
                              </PrismicNextLink>
                            </div>
                            <ul role="list" className="flex flex-col gap-2">
                              {navigationItem.data.subs.map(subItem => (
                                <li key={subItem.label}>
                                  <PrismicNextLink
                                    field={subItem.link}
                                    className="text-sm font-medium text-white/60 transition-all hover:text-white">
                                    {subItem.label}
                                  </PrismicNextLink>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <PrismicNextLink
                            field={navigationItem.data.link}
                            className="text-base font-medium text-white transition-all hover:text-white/80">
                            {navigationItem.data.label}
                          </PrismicNextLink>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </BorderRow>
            <BorderRow>
              <div className="py-2 text-sm md:flex md:items-center md:justify-between">
                <div className="flex space-x-6 md:order-2">
                  <ul role="list" className="flex gap-8">
                    {secondaryNavigation?.items?.map(item => (
                      <li key={item.label}>
                        <PrismicNextLink
                          field={item.link}
                          className="font-medium text-white/50 transition-all hover:text-primary">
                          {item.label}
                        </PrismicNextLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-8 leading-5 text-white/60 md:order-1 md:mt-0">
                  &copy; {copyRightDate} {copyright}
                </p>
              </div>
            </BorderRow>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
