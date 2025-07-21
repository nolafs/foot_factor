import React from 'react';
import cn from 'clsx';

interface BentoCardImageProps {
    columns?: number;
    children?: React.ReactNode;
}

export const BentoCard = ({columns, children}: BentoCardImageProps) => {

  return (
      <div  className={cn("relative min-h-80",
          columns === 1 && 'lg:col-span-1',
          columns === 2 && 'lg:col-span-2',
          columns === 3 && 'lg:col-span-3',
          columns === 4 && 'lg:col-span-4',
          columns === 5 && 'lg:col-span-5',
          columns === 6 && 'lg:col-span-6')}>
        {children}
      </div>
  )
}

export default BentoCard;
