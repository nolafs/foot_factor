import { type Cta } from '@/types';
import { PrismicRichText } from '@prismicio/react';
import cn from 'clsx';
import { buttonVariants } from '@/components/ui/button';
import {Container} from "@/components/ui/container";
import MakeBookingDialog from "@/components/features/make-booking/make-booking-dialog";
import {Wave} from "@/components/wave";

import {Phone} from 'lucide-react'

export function CallToActionBooking({ label, heading, body, telephone }: Cta) {
  return (
    <div className="relative bg-primary-500 w-full pb-16 pt-20 text-center sm:py-24 overflow-hidden">
        <div className={'absolute w-full h-full top-0 left-0 flex items-center justify-center'}>
            <Wave />
        </div>

      <Container className={'relative z-2'}>
          <hgroup>
            <h2
              className={cn('mx-auto mt-6 max-w-2xl text-3xl font-heading font-medium tracking-tight text-background sm:text-5xl'
              )}>
              {heading}
            </h2>
          </hgroup>
          <div
            className={'mx-auto mt-6  text-xl/6 text-gray-300'}>
            <PrismicRichText field={body} />
          </div>
          <div className={'flex justify-center gap-5 mt-6'}>
              <MakeBookingDialog size={'lg'} />
              <a href={`tel:${ telephone }`} className={buttonVariants({variant: 'outline', size: 'lg'})} >Call us <Phone /></a>
          </div>
      </Container>
    </div>
  );
}
