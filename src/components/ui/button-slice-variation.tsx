import {ImageField, type LinkField} from '@prismicio/client';
import {PrismicNextImage, PrismicNextLink} from '@prismicio/next';
import ArrowLongRightIcon from '@heroicons/react/24/outline/ArrowLongRightIcon';
import cn from 'clsx';
import { buttonVariants } from '@/components/ui/button';
import React from 'react';

export const ButtonSliceVariation = ({ link, icon }: { link: LinkField, icon?: ImageField }) => {
  // create key from link name

  if (!link.text) {
    return null;
  }

  return (
    <>
      {link.variant === 'Link' && (
        <PrismicNextLink field={link} className="inline-flex items-center gap-2 text-sm/6 font-medium text-accent hover:text-pink-600">
          {link.text} <ArrowLongRightIcon className="size-5" />
        </PrismicNextLink>
      )}

      {link.variant === 'Accent' && (
        <PrismicNextLink
          field={link}
          className={cn(buttonVariants({ variant: 'default', size: 'lg' }), '!bg-accent text-white hover:!bg-black')}>
          {icon && <PrismicNextImage field={icon} className={'h-5 w-5 aspect-1 mr-2 invert'} />} {link.text}
        </PrismicNextLink>
      )}

      {link.variant === 'Primary' && (
        <PrismicNextLink field={link} className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}>
          {icon && <PrismicNextImage field={icon} className={'h-5 w-5 aspect-1 mr-2 invert'}/>} {link.text}
        </PrismicNextLink>
      )}

      {link.variant === 'Secondary' && (
        <PrismicNextLink field={link} className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}>
          {icon && <PrismicNextImage field={icon} className={'h-5 w-5 aspect-1 mr-2 '}/>} {link.text}
        </PrismicNextLink>
      )}
    </>
  );
};

export default ButtonSliceVariation;
