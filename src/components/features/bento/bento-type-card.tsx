'use client';
import React from 'react';
import {ListSliceBentoPrimaryItemsItem} from '@/prismic-types';
import {PrismicNextImage, PrismicNextLink} from '@prismicio/next';
import cn from 'clsx';
import {Heading, Lead} from '@/components/ui/text';
import {isFilled} from '@prismicio/client';
import {buttonVariants} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import useParallax from '@/lib/hooks/use-parallax';
import { motion } from 'framer-motion';

interface BentoTypeCardProps {
    item:ListSliceBentoPrimaryItemsItem
}

export const BentoTypeCard = ({item}: BentoTypeCardProps) => {

    const parallax = useParallax(0.2, true);


    if(item.card_type === '1') {
        return (isFilled.link(item.link) && <div className={'group/item'}>
            <PrismicNextLink field={item.link} >
                <motion.div
                    ref={parallax.ref}
                    style={{
                        y: parallax.y,
                        scale: parallax.scale
                    }}
                    className="absolute inset-0 z-10"
                >
                    <PrismicNextImage field={item.image} className={cn('absolute md:relative w-full h-full object-cover transition delay-150 duration-300 ease-in-out group-hover/item:scale-105')}/>
                </motion.div>
                <div
                    className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary-950/70 to-transparent max-lg:rounded-4xl lg:rounded-4xl overflow-hidden"/>
                <div className="relative mt-32 md:mt-0 md:absolute  z-5 bottom-0 p-7 md:p-10 lg:p-16  z-10 w-full">
                    <Heading as={'h3'} color={'White'} className={'group-hover/item:text-accent'}>{item.heading}</Heading>
                    <Lead className="mt-2 max-w-2xl" color={'Light'} size={'sm'}>
                        {item.lead}
                    </Lead>
                    <div className={'flex justify-end'}>
                            <div className={cn('bg-accent rounded-full h-12 w-12 flex justify-center items-center text-neutral-50 group-hover/item:bg-primary group-hover/item:text-accent')}>
                                <ArrowRight size={22} strokeWidth={4}/>
                            </div>
                        </div>

                </div>
            </PrismicNextLink>
            </div>
        )
    }

    if (item.card_type === '2') {
        return (isFilled.link(item.link) && <div className={'group/item'}>
            <PrismicNextLink field={item.link}>
                <div className="p-7 sm:p-7 md:p-10 lg:p-16 text-center">
                    {item.image_position === 'top' && (<div className={'w-full h-auto  mb-5'}>
                            <PrismicNextImage field={item.image} className={cn('w-full h-full object-cover')}/>
                        </div>
                    )}
                    <Heading as={'h3'} className="text-secondary-950 group-hover/item:text-accent">{item.heading}</Heading>
                    <Lead className="mt-2 max-w-2xl text-lg" size={'sm'}>
                        {item.lead}
                    </Lead>
                </div>
                {item.image_position === 'bottom' && (<div className={'block md:hidden h-52'}/>)}
                {item.image_position === 'bottom' && (<div className={'absolute bottom-0 w-full h-auto'}>
                        <PrismicNextImage field={item.image} className={cn('w-full h-full object-cover')}/>
                    </div>
                )}


                <div className={'relative z-10 md:absolute bottom-0 w-full p-7 md:p-10 lg:p-16 flex justify-end'}>
                    <div
                        className={cn('bg-accent rounded-full h-12 w-12 flex justify-center items-center text-neutral-50 group-hover/item:bg-primary group-hover/item:text-accent')}>
                        <ArrowRight size={22} strokeWidth={4}/>
                    </div>
                </div>
            </PrismicNextLink>
            </div>
        )
    }
}

export default BentoTypeCard;
