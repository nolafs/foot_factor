'use client';
import React from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import {Container} from '@/components/ui/container';
import {VerticalStepsWithImagesSliceVideoVerticalStepperPrimary} from '@/prismic-types';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';
import {isFilled} from '@prismicio/client';
import {Body, Heading} from '@/components/ui/text';
import {PrismicRichText} from '@prismicio/react';
import ButtonRow from '@/components/ui/button-row';
import SectionContent from '@/components/features/section/section-content';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface StepsMediaProps {
    data: VerticalStepsWithImagesSliceVideoVerticalStepperPrimary;
}

export const StepsMedia = ({data}: StepsMediaProps) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);


    useGSAP(() => {

        if (!contentRef.current || !listRef.current) return;

    }, {scope: contentRef, dependencies: [data]});

  return (
      <section>
          <div ref={contentRef} className={'relative w-full isolate'}>
              <ul ref={listRef} className={'w-full flex flex-col'}>
                <li>
                  <div className={'relative w-full h-full max-h-svh isolated overflow-hidden'}>
                    <div className={'w-full h-full flex justify-center'}>
                      <PrismicNextImage field={data.intro_image}
                                        className={cn('w-full h-full object-center object-cover')}/>
                    </div>
                    <div className={'absolute top-0 left-0 w-full h-full z-5 bg-black/30'}></div>
                      <div className={'absolute z-10 top-0 left-0 w-full'}>
                          <div
                              className={cn('flex flex-col w-full h-svh justify-center items-center')}>
                            <div
                                className={cn('flex flex-col w-full md:w-6/12 lg:w-6/12 xl:w-5/12  pt-16 md:pt-24 lg:py-32')}>
                              {isFilled.richText(data.intro_body) && (
                                  <Heading as={'h2'} primary={true} className={'content-master primary text-center text-animation'}>
                                    <PrismicRichText field={data.intro_body}/>
                                  </Heading>
                              )}
                            </div>
                          </div>

                      </div>
                  </div>
                </li>
              </ul>
          </div>
      </section>
  )
}

const StepMedia = ({data}: StepsMediaProps) => {
  const cardRef = React.useRef<HTMLLIElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

  }, {scope: cardRef});


  return (
      <li ref={cardRef}>
        <div className={'relative w-full h-full max-h-svh isolated overflow-hidden'}>

          test
        </div>
      </li>
  );

}

export default StepsMedia;
