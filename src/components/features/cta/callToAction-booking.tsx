import { Subheading } from '@/components/ui/text';
import { type Cta } from '@/types';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';
import cn from 'clsx';
import { buttonVariants } from '@/components/ui/button';
import {Container} from "@/components/ui/container";

export function CallToActionBooking({ label, heading, body }: Cta) {
  return (
    <div className="relative w-full pb-16 pt-20 text-center sm:py-24">
      <Container>
      <hgroup>
        <Subheading>{label}</Subheading>
        <p
          className={cn('mx-auto mt-6 max-w-2xl text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl'
          )}>
          {heading}
        </p>
      </hgroup>
      <div
        className={'mx-auto mt-6 max-w-xs text-sm/6 text-gray-500'}>
        <PrismicRichText field={body} />
      </div>
      </Container>
    </div>
  );
}
