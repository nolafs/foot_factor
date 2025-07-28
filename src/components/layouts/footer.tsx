import type {Cta, LinkPrismicType, SocialLinkItemType} from '@/types';
import {PrismicNextImage, PrismicNextLink} from '@prismicio/next';
import React from 'react';
import Link from 'next/link';
import SocialList from '../features/social-list/social-list';
import { Container } from '@/components/ui/container';
import { type
  NavigationBarDocumentData,
  type NavigationElementDocument, type NavigationMegaMenuItemDocument, type SettingsDocumentData,
} from '../../../prismicio-types';
import {CallToActionBooking} from "@/components/features/cta/callToAction-booking";
import ReviewSliderElfsight from "@/components/features/reviews/review-slider-elfsight";




export interface FooterProps {
  navigation: NavigationBarDocumentData;
  settings: SettingsDocumentData;
}

export function Footer({ navigation, settings }: FooterProps) {
  const copyRightDate = new Date().getFullYear();

  const footerCta: Cta = {
    heading: settings?.footer_cta_heading ?? '',
    body: settings?.footer_cta_body ?? '',
    telephone: settings?.telephone ?? ''
  };

  const social: SocialLinkItemType[] | undefined = settings?.social_media?.map(item => ({
    type: item.type,
    name: item.name,
    url: item.url as LinkPrismicType,
  }));


  return (
    <footer>
      <CallToActionBooking {...footerCta}  />
      <div className="relative bg-primary pt-16 sm:pt-24 md:pt-24">
        <Container className={'relative z-10 block pb-10'}>
              <div className="mt-10 grid grid-cols-2 gap-y-10 pb-10 lg:grid-cols-6 lg:gap-8">
                <div className="col-span-2 flex flex-col justify-between">
                  <Link href="/" className={'grow'} >
                    <h2 id="footer-heading" className="sr-only">
                      Foot Factor
                    </h2>
                    <PrismicNextImage field={settings.footer_logo} className="inline !max-w-[250px]" />
                  </Link>
                </div>
                <div className={"col-span-2 grid grid-cols-2 gap-x-5 gap-y-12 lg:col-span-4  lg:grid-cols-3"}>
                  {navigation?.navigation_items.map(item => {
                    const navigationItem = item.navigation_item as unknown as NavigationElementDocument | NavigationMegaMenuItemDocument;

                    if (navigationItem.type === 'navigation_element') {
                      return (
                          <div key={navigationItem.data.label}>
                            {navigationItem.data.subs[0]?.label ? (
                                <>
                                  <div className={'mb-10 mt-3'}>
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
                                <div className={'mb-10 mt-3'}>
                                  <PrismicNextLink
                                      field={navigationItem.data.link}
                                      className="text-base font-medium text-white transition-all hover:text-white/80">
                                    {navigationItem.data.label}
                                  </PrismicNextLink>
                                </div>
                            )}
                          </div>
                      );
                    } else if (navigationItem.type === 'navigation_mega_menu_item') {
                      if (!navigationItem.data) {
                        return null;
                      }

                      return (
                          <div key={navigationItem.data.label}>
                            {navigationItem.data.subs[0]?.label ? (
                                <>
                                  <div className={'mb-10 mt-3'}>
                                    {navigationItem.data?.link?.text ? (
                                        <PrismicNextLink
                                            field={navigationItem.data.link}
                                            className="text-base font-medium text-white transition-all hover:text-white/80">
                                        </PrismicNextLink>
                                    ) : (
                                        <span className={'className="text-base font-medium text-white transition-all hover:text-white/80"'}>{navigationItem.data.label}</span>
                                    )}

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
                                <div className={'mb-10 mt-3'}>
                                  <PrismicNextLink
                                      field={navigationItem.data.link}
                                      className="text-base font-medium text-white transition-all hover:text-white/80">
                                    {navigationItem.data.link.text}
                                  </PrismicNextLink>
                                </div>
                            )}
                          </div>
                      );
                    }
                  })}
                </div>
              </div>
          <div className={'flex flex-col md:flex-row md:justify-between  md:space-x-5 pb-10 md:py-10'}>
            <div>{!settings.google_widget && settings.google_rating && <PrismicNextImage field={settings.google_rating}/>}
              {settings.google_widget && ( <ReviewSliderElfsight share_link={settings.google_widget} width={'auto'} />)}
            </div>
            <div> {social && <SocialList items={social} icons={true} variantList={1} variantButton={3}/>}</div>
          </div>
          <div className="py-2 text-sm md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <ul role="list" className="flex gap-8">
                {settings.secondary_navigation?.map(item => (
                    <li key={item.link.text}>
                      <PrismicNextLink
                          field={item.link}
                          className="font-medium text-white/50 transition-all hover:text-secondary">
                        {item.link.text}
                      </PrismicNextLink>
                    </li>
                ))}
              </ul>
            </div>
            <p className="mt-8 leading-5 text-white/60 md:order-1 md:mt-0">
              &copy; {copyRightDate} {settings.copyright_line}
            </p>
          </div>

        </Container>
      </div>
    </footer>
  );
}

export default Footer;
