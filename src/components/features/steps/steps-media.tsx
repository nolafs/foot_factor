'use client';
import React, {Suspense, useEffect} from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';

import {
 type VerticalStepsWithImagesSliceVideoVerticalStepperPrimary,
    type VerticalStepsWithImagesSliceVideoVerticalStepperPrimaryStepsItem

} from '@/prismic-types';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';
import {isFilled} from '@prismicio/client';
import {Body, Heading} from '@/components/ui/text';
import {PrismicRichText} from '@prismicio/react';
import ButtonRow from '@/components/ui/button-row';
import type ReactPlayer from 'react-player';

import dynamic from 'next/dynamic';

const DynamicReactPlayer = dynamic(() => import('react-player/lazy'), {
    ssr: false
});

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface StepsMediaProps {
    data: VerticalStepsWithImagesSliceVideoVerticalStepperPrimary;
}

export const StepsMedia = ({data}: StepsMediaProps) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);


    useGSAP(() => {

        if (!contentRef.current || !listRef.current) return;

        gsap.to('.intro', {
            y: '-50%',
            scrollTrigger: {
                trigger: '.intro',
                start: 'top top',
                end: '+=200%',
                scrub: 0.3,
                pin: true,
                pinSpacing: false,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        gsap.fromTo('.intro-text', {opacity: 0}, {
          opacity: 1,
          scrollTrigger: {
            trigger: '.intro-text',
              start: 'top center',
              end: 'bottom center+=20%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            //markers: true,
          }
        })

    }, {scope: contentRef, dependencies: [data]});

    useEffect(() => {
        ScrollTrigger.refresh();
    }, [data]);

    useEffect(() => {
        const handleResize = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (

          <div ref={contentRef} className={'relative w-full isolate overflow-hidden z-0'}>
              <div ref={listRef} className={'w-full flex flex-col'}>
                <div>
                  <div className={'intro z-5 relative w-full h-screen isolated overflow-hidden'}>
                    <div className={'w-full h-full flex justify-center'}>

                      <PrismicNextImage field={data.intro_image}
                                        className={cn('w-full h-full object-center object-cover')}/>
                    </div>
                    <div className={'absolute top-0 left-0 w-full h-full z-5 bg-black/30'}></div>
                      <div className={'absolute z-10 top-0 left-0 w-full'}>
                          <div
                              className={cn('flex flex-col w-full h-svh justify-center items-center')}>
                            <div
                                className={cn('intro-text flex flex-col w-full md:w-6/12 lg:w-6/12 xl:w-5/12  pt-16 md:pt-24 lg:py-32')}>
                              {isFilled.richText(data.intro_body) && (
                                  <Heading as={'h2'} primary={true} className={'content-master primary text-center text-animation'}>
                                    <PrismicRichText field={data.intro_body}/>
                                  </Heading>
                              )}
                            </div>
                          </div>

                      </div>
                  </div>
                </div>
                <ul className={'relative w-full z-0'}>
                {data.steps.map((step, idx) => (<StepMedia key={'video_stepper'+idx} index={idx} totalItems={data.steps.length} data={step}/>))}
                <li className={'relative h-svh'}></li>
                </ul>
              </div>
          </div>)
}

interface StepMediaProps {
  data: VerticalStepsWithImagesSliceVideoVerticalStepperPrimaryStepsItem;
  index: number;
  totalItems: number;
}



const StepMedia = ({data, index, totalItems}: StepMediaProps) => {
  const cardRef = React.useRef<HTMLLIElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<ReactPlayer>(null);

    useGSAP(({ context }) => {
        if (!cardRef.current) return;


        const card = cardRef.current;
        const image = imageRef.current;
        const content = contentRef.current;


        if (isFilled.linkToMedia(data.video) ) {

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom+=100% top',
                    markers: false,
                    onEnter: () => videoRef.current?.getInternalPlayer()?.play(),
                    onLeave: () => videoRef.current?.getInternalPlayer()?.pause(),
                    onEnterBack: () => videoRef.current?.getInternalPlayer()?.play(),
                    onLeaveBack: () => videoRef.current?.getInternalPlayer()?.pause(),
                })

        }

        if (index === 0) {

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    end: `+=${200 * totalItems}%`,
                    pin: true,
                    pinSpacing: false,
                    anticipatePin: 1,
                })

        } else {

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    end: `+=${100 * totalItems}%`,
                    pin: true,
                    pinSpacing: false,
                    anticipatePin: 1,
                })



                gsap.fromTo(
                    image,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top top',
                            end: `+=100%`,
                            scrub: 0.3,
                            invalidateOnRefresh: true,
                        },
                    }
                )

        }


            gsap
                .timeline({
                    scrollTrigger: {
                        trigger: content,
                        start: 'top top',
                        end: '+=100%',
                        scrub: 0.5,
                        pin: true,
                        pinSpacing: false,
                        invalidateOnRefresh: true,
                    },
                })
                .fromTo(
                    content,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                    }
                )
                .to(content, {
                    opacity: 0,
                    y: '-100%',
                    duration: 1,
                    ease: 'power2.in',
                })

    }, { scope: cardRef, dependencies: [index, totalItems, videoRef.current] });

    useEffect(() => {
        ScrollTrigger.refresh();
    }, [data]);


  return (
      <li ref={cardRef} className={'relative isolate'} >


        <div ref={imageRef} className={'absolute w-full h-screen flex -z-0 justify-center'} style={{zIndex: index + 1}}>
          <div className={'absolute top-0 left-0 w-full h-full z-20 bg-black/60'}></div>
          {isFilled.linkToMedia(data.video) && (
              <DynamicReactPlayer
                  ref={videoRef}
                url={data.video.url}
                controls={false}
                muted={true}
                loop={true}
                autoPlay={true}
                playsinline={true}
                loading={'eager'}
                poster={data.image.url}
                  width="100%"
                  height="100%"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    zIndex: 1
                  }}
                  config={{
                    file: {
                      attributes: {
                        style: {
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }
                      }
                    }
                  }}
              />


          )}
          <PrismicNextImage loading={'eager'} field={data.image} className={cn('w-full h-full object-center object-cover')}/>

        </div>


        <div ref={contentRef} className={'relative w-full z-20  h-screen flex flex-col justify-center container mx-auto'}>
          <div  className={cn('flex w-full', data.alignment === 'Left' ? 'md:justify-start' : 'md:justify-end')}>
            <div className={'flex flex-col md:w-1/2 px-4 md:px-8 lg:px-16 xl:px-24'}>
            {isFilled.keyText(data.title) && (
                <Heading as={'h2'} primary={true} color={'accent'} className={'content-master primary'}>
                  {data.title}
                </Heading>
            )}
            {isFilled.richText(data.description) && (
                <Body className={'mt-4'} color={'Light'} >
                  <PrismicRichText field={data.description}/>
                </Body>
            )}
            <div className="flex flex-col gap-x-3 gap-y-4 sm:flex-row">
              <ButtonRow hasBooking={true} bookingLabel={'Book Now'} hasArrow={true}
                         links={data.links}/>
            </div>
          </div>
          </div>
        </div>
      </li>
  );

}

export default StepsMedia;
