import React from 'react';
import { Wave } from '@/components/wave';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';

interface CallToActionWaveWrapperProps {
  children?: React.ReactNode;
  framed?: boolean;
  className?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export const CallToActionWaveWrapper = ({
  children,
  framed = false,
  textAlign = 'center',
  className,
}: CallToActionWaveWrapperProps) => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-primary-500 pb-10 pt-10 text-center sm:py-24 md:pb-16 md:pt-20',
        textAlign === 'left' && 'text-left',
        textAlign === 'right' && 'text-right',
        textAlign === 'center' && 'text-center',
        framed && 'mx-auto max-w-2xl rounded-2xl border border-primary-600 lg:max-w-8xl',
        className,
      )}>
      <div className={'absolute inset-0 h-full w-full overflow-hidden'}>
        <Wave />
      </div>

      <Container className={'z-2 relative'}>{children}</Container>
    </div>
  );
};

export default CallToActionWaveWrapper;
