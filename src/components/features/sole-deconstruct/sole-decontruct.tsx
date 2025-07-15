'use client';
import React from 'react';
import {SoleDeconstructSliceDefaultPrimaryItemsItem} from '@/prismic-types';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import {Body} from '@/components/ui/text';
import {PrismicRichText} from '@prismicio/react';

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
                trigger: contentRef.current,
                start: "center center",
                end: "bottom top",
                scrub: true,
                pin: true,
                markers: true,
            }
        })

        tl.to('.item-content', {opacity: 1, duration: 0.5})

    }, {scope: contentRef, dependencies: [data]});


  return (
      <div ref={contentRef}>
            <div className={'grid grid-cols-2 h-svh'}>
                <div>Image</div>
                <div className={'flex flex-col gap-4'}>
                    {data.map((item, index) => (
                        <div key={index} className={'item-content flex flex-col gap-2 opacity-0'}>
                            <h3 className={'text-lg font-semibold'}>{item.title}</h3>
                            <Body>
                                <PrismicRichText field={item.body}/>
                            </Body>
                        </div>
                    ))}
                </div>
        </div>
      </div>
  )
}

export default SoleDeconstructor;
