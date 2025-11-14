'use client';
import React from 'react';
import {type SoleDeconstructSliceDefaultPrimaryItemsItem} from '@/prismic-types';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import {Body} from '@/components/ui/text';

import {Container} from '@/components/ui/container';
import {PrismicNextImage} from '@prismicio/next';
import {cn} from '@/lib/utils';


if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface SoleDeconstructProps {
    data: SoleDeconstructSliceDefaultPrimaryItemsItem[];
}

export const SoleDeconstructor = ({data}: SoleDeconstructProps) => {

    const contentRef = React.useRef<HTMLDivElement>(null);

    useGSAP(() => {

        if (!contentRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.image',
                start: "top top+=20%",
                end: "bottom bottom",
                endTrigger: contentRef.current,
                scrub: true,
                pin: true,
                pinSpacing: false,
                markers: false,
            }
        })

        //tl.to('.item-content', {opacity: 1, duration: 0.5})

        const contentItems = gsap.utils.toArray('.item-content');
        const bodyText = gsap.utils.toArray('.body-text');

        contentItems.forEach((item, index) => {
            const itemTl = gsap.timeline({
                scrollTrigger: {
                    trigger: item as Element,
                    start: "top bottom",
                    end: "bottom center",
                    onEnter: () => {
                        // fade in the indicator for the current item
                        gsap.fromTo(`.item-image-${index}`, {
                            opacity: 0,
                            y: '100%',
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            ease: 'power2.out',
                        });

                        gsap.to(`.indicator-${index}`, {
                            opacity: 1,
                            duration: 0.5,
                            ease: 'power2.out',
                        });
                    },
                    onEnterBack: () => {
                        // fade in the indicator for the current item when scrolling back
                        gsap.to(`.indicator-${index}`, {
                            opacity: 1,
                            duration: 0.5,
                            ease: 'power2.out',
                        });
                    },
                    scrub: true,
                    markers: false,
                }
            });

            itemTl.fromTo(item as GSAPTweenTarget, {
                opacity: 0,
                y: 0,
            }, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
            });
        });



        //fade in body text
        bodyText.forEach((text, index) => {
            gsap.fromTo(text as GSAPTweenTarget, {
                opacity: 0,
                y: '100%',
            }, {
                opacity: 1,
                y: 0,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: text as Element,
                    start: "top 80%",
                    end: "bottom+=200% 80%",
                    scrub: true,
                    markers: false,
                }
            });
        });

        // indicator animation

    }, {scope: contentRef, dependencies: [data]});


  return (<Container ref={contentRef} as={'section'} padding={'base'} color={'secondary'}>
            <div className={'flex  min-h-svh py-10 md:py-20 lg:py-32'}>
                <div className={'w-1/2 image relative h-svh pt-20'}>
                    {data.map((item, index) => (
                        <div key={index} className={`item-image-${index} absolute w-full opacity-0`}>
                            <PrismicNextImage field={item.image} />
                        </div>
                    ))}
                    {data.map((item, index) => (
                        <div key={index} className={cn(`indicator-${index} item-image absolute w-full opacity-0`)}>
                            <PrismicNextImage field={item.indicator}/>
                        </div>
                    ))}
                </div>
                <div className={'w-1/2'}>
                    {data.map((item, index) => (
                        <div key={index} className={'item-content flex flex-col gap-2 h-svh last:h-[50vh]  opacity-1 my-5 opacity-0'}>
                            <header  className={'flex space-x-5 items-center mb-5'}>
                            <div className={'header-num border border-primary-400 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-primary-400 '}>
                                <span>{index + 1}</span>
                            </div>
                            <h3 className={'header-text text-2xl md:text-3xl lg:text-4xl font-medium'}>{item.title}</h3>
                            </header>
                            <div className={'body-text'}>
                            <Body>
                                {item.excerpt}
                            </Body>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
      </Container>
  )
}

export default SoleDeconstructor;
