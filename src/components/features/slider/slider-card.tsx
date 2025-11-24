import React from 'react';
import Link from 'next/link';
import { PrismicNextImage } from '@prismicio/next';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ImageField } from '@prismicio/client';
import { Badge } from '@/components/ui/badge';

interface SliderCardProps {
  index: number;
  keyPrefix?: string;
  className?: string;
  imageField?: ImageField | null; // Prismic image field type
  href: string;
  title: string;
  subtitle?: string;
  description?: string;
  aspectRatio?: string;
  size?: 'default' | 'large';
  showArrow?: boolean;
  contentType?: string; // e.g., 'guide', 'orthotics'
  children?: React.ReactNode;
}

export function SliderCard({
  index,
  keyPrefix = 'slider_card',
  className,
  imageField,
  href,
  title,
  subtitle,
  description,
  contentType,
  aspectRatio = 'portrait',
  size = 'default',
  showArrow = true,
  children,
}: SliderCardProps) {
  const aspectClasses = aspectRatio === 'portrait' ? 'aspect-w-3 aspect-h-4' : 'aspect-w-9 aspect-h-10';

  const sizeClasses = size === 'large' ? 'w-full  max-h-[600px] max-w-[540px]' : 'w-full  max-w-[380px] max-h-[420px]';

  return (
    <div
      key={`${keyPrefix}_${index}`}
      className={cn(
        'flex-shrink-0 snap-center scroll-ml-[var(--scroll-padding)]',
        sizeClasses,
        size === 'large' ? 'px-2.5 py-2 md:py-10 lg:px-5' : 'px-2 py-5 lg:px-2',
        className,
      )}>
      <Link href={href} className={'group'}>
        <div
          className={cn(
            'bg-secondary-100 relative flex-shrink-0 flex-col justify-end overflow-hidden rounded-3xl max-lg:rounded-4xl lg:rounded-4xl',
            sizeClasses,
          )}>
          <div className={aspectClasses}>
            {imageField && (
              <PrismicNextImage
                field={imageField}
                width={size === 'large' ? 540 : 331}
                height={size === 'large' ? 600 : 400}
                className={cn(
                  'left-0 top-0 h-full w-full object-cover object-center transition delay-150 duration-300 ease-in-out group-hover:scale-105',
                )}
              />
            )}
          </div>

          <div className="absolute inset-0 overflow-hidden rounded-lg bg-gradient-to-t from-primary-950/90 to-transparent max-lg:rounded-4xl lg:rounded-4xl" />

          <div
            className={cn(
              'absolute bottom-0 z-10 flex w-full flex-col',
              size === 'large' ? 'p-7 md:p-10 lg:p-10' : 'p-5 md:p-8 lg:p-8',
            )}>
            {contentType && (
              <div className={'mb-1'}>
                <Badge variant={'secondary'}>{contentType}</Badge>{' '}
              </div>
            )}
            <h3
              className={cn(
                'font-semibold group-hover:text-accent',
                size === 'large' ? 'text-4xl text-white' : 'text-3xl text-white',
              )}>
              {title}
            </h3>
            {subtitle && <div className={'text-2xl text-primary-300'}>{subtitle}</div>}
            {description && <div className="text-xl text-white">{description}</div>}
            {children}
            {showArrow && (
              <div className="mt-2 flex justify-end">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full bg-accent text-neutral-50 group-hover:bg-primary group-hover:text-accent',
                  )}>
                  <ArrowRight size={22} strokeWidth={4} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
