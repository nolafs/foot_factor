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
  wave?: string;
  fullWidth?: boolean;
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
      wave,
      fullWidth = false,
      ...rest
    }: ContainerProps<T>,
    ref: React.Ref<React.ElementRef<T>>
) {
  const Component = as ?? 'div';
  let backgroundColorClass = '';
  const colorLowerCase = color.toLowerCase();

  switch (colorLowerCase) {
    case 'primary':
      backgroundColorClass = 'bg-primary';
      break;
    case 'secondary':
      backgroundColorClass = 'bg-primary-200';
      break;
    case 'accent':
      backgroundColorClass = 'bg-accent-50';
      break;
    case 'muted':
      backgroundColorClass = 'bg-muted';
      break;
    case 'default':
      backgroundColorClass = 'bg-white';
      break;
  }

  return (
      <Component
          ref={ref}
          className={cn('relative w-full mx-auto overflow-hidden z-10',
              className,
              backgroundColorClass,
              padding === 'base' && (!fullWidth && 'px-6 lg:px-8'),
              padding === 'md' && (!fullWidth ? 'px-6 lg:px-8 py-10 md:py-16 lg:py-20' : 'py-10 md:py-16 lg:py-20'),
              padding === 'lg' && (!fullWidth ? 'px-6 lg:px-8 py-16 md:py-24 lg:py-28' : 'py-16 md:py-24 lg:py-28'),
          )}
          {...rest}
      >
        {wave && (
            <div className={'absolute inset-0 w-full h-full overflow-hidden'}>
              <Wave waveType={wave}/>
            </div>
        )}
        <div className={cn("relative w-full z-20", !fullWidth && 'container mx-auto ')}>{children}</div>
      </Component>
  );
});

ContainerComponent.displayName = 'Container';

const Container = ContainerComponent as PolymorphicContainer;

export {Container};
