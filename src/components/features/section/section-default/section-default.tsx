'use client';
import {KeyTextField, RichTextField} from '@prismicio/client';
import React ,{useRef} from 'react';
import {Container} from '@/components/ui/container';
import {PrismicRichText} from '@prismicio/react';
import gsap from 'gsap';
import {useGSAP}  from '@gsap/react';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';
import {SplitText} from 'gsap/dist/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface SectionDefaultProps {
    heading?: KeyTextField | string;
    body?: RichTextField;
    animated?: boolean;
    variation?: 'default';
    slice_type?: string;
}

export const SectionDefault = ({heading, body, animated, slice_type, variation}: SectionDefaultProps) => {

    const container = useRef<HTMLDivElement | null>(null);
    const wrapperRef  = useRef<HTMLDivElement | null>(null);

    useGSAP(() => {

      if(!animated) return;
      if(!container.current) return;
      if(!wrapperRef.current) return;

      const splits = new SplitText('.text-animation', {type: "words,chars, lines"});

      gsap
          .timeline({
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top 30%",
              end: "130% center",
              scrub: true,
              //pin: ".text-animation",
              markers: false,
            }
          })
          .fromTo(
              splits.chars,
              {opacity:0.15},
              {
                opacity: 1,
                stagger: 0.08,
                ease: "power2.out",
              },
              0
          );

    }, {scope: wrapperRef});

    return (
      <section ref={wrapperRef} className={'w-full'} data-slice-type={slice_type} data-slice-variation={variation}>
        <Container className={'lg:py-28 py-16 md:py-24'}>
            <div className={'flex gap-5 md:gap-8'}>
                <div className={'w-full sm:w-full md:w-1/4 lg:w-5/12'}>
                    <h2 className={'font-heading font-medium text-2xl md:text-3xl lg:text-4xl'}>{heading}</h2>
                </div>
                <div ref={container} className={'w-full content-master text-animation font-medium font-heading text-3xl sm:text-4xl md:text-5xl leading-normal lg:text-6xl lg:leading-[72px]'}>
                    <PrismicRichText field={body} />
                </div>
            </div>
        </Container>
      </section>
  )
}

export default SectionDefault;
