import {cn} from '@/lib/utils';
import React, {
  forwardRef,
  type ElementType,
  type ComponentPropsWithRef,
  type ReactNode
} from 'react';
import {Wave} from '@/components/wave';

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
  padding?: 'sm' | 'md' | 'base' | 'lg';
  color?:  string;
  wave?: boolean;
} & ComponentPropsWithRef<T>;

type PolymorphicContainer = <T extends ElementType = 'div'>(
    props: ContainerProps<T> & {
      ref?: React.Ref<React.ElementRef<T>>
    }
) => React.ReactElement | null;

const ContainerComponent = forwardRef<
    HTMLDivElement,
    ContainerProps<ElementType>
>(function Container<T extends ElementType = 'div'>(
    {
      as,
      className,
      children,
      padding = 'base',
      color = 'transparent',
      wave = false,
      ...rest
    }: ContainerProps<T>,
    ref: React.Ref<React.ElementRef<T>>
) {
  const Component = as ?? 'div';
  let backgroundColorClass = '';

  switch (color) {
    case 'primary':
      backgroundColorClass = 'bg-primary';
      break;
    case 'secondary':
      backgroundColorClass = 'bg-secondary';
      break;
    case 'accent':
      backgroundColorClass = 'bg-accent-50';
      break;
    case 'muted':
      backgroundColorClass = 'bg-muted';
      break;
    case 'default':
      backgroundColorClass = 'bg-background';
      break;
  }

  return (
      <Component
          ref={ref}
          className={cn('relative w-full overflow-hidden',
              className,
              backgroundColorClass,
              padding === 'base' && 'px-6 lg:px-8',
              padding === 'lg' && 'py-16 md:py-24 lg:py-28'
          )}
          {...rest}
      >
        {wave && (
            <div className={'absolute inset-0 w-full h-full overflow-hidden'}>
              <Wave/>
            </div>
        )}
        <div className="relative container mx-auto w-full z-20">{children}</div>
      </Component>
  );
});

ContainerComponent.displayName = 'Container';

const Container = ContainerComponent as PolymorphicContainer;

export {Container};
