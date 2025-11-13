import { type Cta } from '@/types';
import { PrismicRichText } from '@prismicio/react';
import cn from 'clsx';
import { buttonVariants } from '@/components/ui/button';
import MakeBookingDialog from "@/components/features/make-booking/make-booking-dialog";

import {Phone} from 'lucide-react'
import CallToActionWaveWrapper from '@/components/features/cta/cta-wave-wrapper';

export function CallToActionBooking({ heading, body, telephone }: Cta) {
  return (
    <CallToActionWaveWrapper>
          <h2
            className={cn('mx-auto mt-6 max-w-2xl text-3xl font-heading font-medium tracking-tight text-background sm:text-5xl'
            )}>
            {typeof heading === 'string' ? (
                heading
            ) : (
                <PrismicRichText field={heading}/>
            )}
          </h2>
          <div
            className={'mx-auto mt-6  text-xl/6 text-gray-300'}>
            <PrismicRichText field={body} />
          </div>
          <div className={'flex justify-center gap-5 mt-6'}>
              <MakeBookingDialog size={'lg'} />
              <a href={`tel:${ telephone }`} className={buttonVariants({variant: 'outline', size: 'lg'})} >Call us <Phone /></a>
          </div>
    </CallToActionWaveWrapper>
  );
}
