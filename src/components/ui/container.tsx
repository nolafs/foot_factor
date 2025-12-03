import { cn } from '@/lib/utils';
import React, { forwardRef, type ElementType, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Wave } from '@/components/wave';
import { WaveType } from '@/components/features/hero/hero-simple';

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
  padding?: 'sm' | 'md' | 'base' | 'lg';
  color?: string;
  wave?: string;
  fullWidth?: boolean;
} & Omit<ComponentPropsWithRef<T>, 'as'>;

type PolymorphicContainer = <T extends ElementType = 'div'>(
  props: ContainerProps<T> & {
    ref?: React.Ref<Element>;
  },
) => React.ReactElement | null;

const ContainerComponent = forwardRef(function Container<T extends ElementType = 'div'>(
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
  ref: React.Ref<Element>,
) {
  const Component = (as ?? 'div') as ElementType;
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
    default:
      backgroundColorClass = 'bg-transparent';
      break;
  }

  return (
    <Component
      ref={ref}
      className={cn(
        'relative z-10 mx-auto w-full overflow-hidden',
        className,
        backgroundColorClass,
        padding === 'base' && !fullWidth && 'px-6 lg:px-8',
        padding === 'md' && (!fullWidth ? 'px-6 py-10 md:py-16 lg:px-8 lg:py-20' : 'py-8 md:py-16 lg:py-20'),
        padding === 'lg' && (!fullWidth ? 'px-6 py-16 md:py-24 lg:px-8 lg:py-28' : 'py-8 md:py-24 lg:py-28'),
      )}
      {...rest}>
      {wave && (
        <div className={'absolute inset-0 h-full w-full overflow-hidden'}>
          <Wave waveType={wave as WaveType} />
        </div>
      )}
      <div className={cn('relative z-20 w-full', !fullWidth && 'container mx-auto')}>{children}</div>
    </Component>
  );
});

ContainerComponent.displayName = 'Container';

const Container = ContainerComponent as PolymorphicContainer;

export { Container };
