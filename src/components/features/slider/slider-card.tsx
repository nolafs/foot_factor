import React from 'react';
import Link from 'next/link';
import {PrismicNextImage} from '@prismicio/next';
import {ArrowRight} from 'lucide-react';
import {cn} from '@/lib/utils';
import {buttonVariants} from '@/components/ui/button';
import {ImageField} from '@prismicio/client';
import {Badge} from '@/components/ui/badge';

interface SliderCardProps<T> {
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

export function SliderCard<T>({
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
                                children
                              }: SliderCardProps<T>) {
  const aspectClasses = aspectRatio === 'portrait'
      ? 'aspect-w-3 aspect-h-4'
      : 'aspect-w-9 aspect-h-10';

  const sizeClasses = size === 'large'
      ? 'w-full  max-h-[600px] max-w-[540px]'
      : 'w-full  max-w-[331px] max-h-[408px]';

  return (
      <div
          key={`${keyPrefix}_${index}`}
          className={cn(
              "px-2.5 lg:px-5  py-10 flex-shrink-0 snap-center scroll-ml-[var(--scroll-padding)]",
              sizeClasses,
              className
          )}
      >
        <div className={cn('relative bg-secondary-100 flex-shrink-0 flex-col justify-end overflow-hidden rounded-3xl max-lg:rounded-4xl lg:rounded-4xl',
          sizeClasses
        )}>
          <div className={aspectClasses}>
            {imageField && (
            <PrismicNextImage
                field={imageField}
                width={size === 'large' ? 540 : 331}
                height={size === 'large' ? 600 : 400}
                className={cn("top-0 left-0 h-full w-full object-cover object-center")}
            />
            )}
            </div>

          <div
              className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary-950/90 to-transparent max-lg:rounded-4xl lg:rounded-4xl overflow-hidden"/>

          <div className={cn("absolute bottom-0 w-full  flex flex-col z-10", size === 'large' ? 'p-7 md:p-10 lg:p-10' : 'p-5 md:p-8 lg:p-8')}>
            {contentType && <div className={'mb-1'}><Badge variant={'secondary'}>{contentType}</Badge> </div>}

            <div className={cn(size === 'large' ? "text-white text-3xl" : 'text-white text-xl')}>{title}</div>

            {subtitle && (
                <div className={"text-primary-300 text-2xl"}>{subtitle}</div>
            )}

            {description && (
                <div className="text-white text-xl">{description}</div>
            )}

            {children}

            {showArrow && (
                <div className="flex justify-end mt-2">
                  <Link
                      href={href}
                      className={cn(buttonVariants({variant: 'default', size: 'icon'}))}
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={4}/>
                  </Link>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
