import React from 'react';
import {cn} from '@/lib/utils';

interface BentoWrapperProps {
    children?: React.ReactNode;
    className?: string;
}

export const BentoWrapper = ({children, className}: BentoWrapperProps) => {

  return (
      <div className={cn("mt-10 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-6  grid-flow-row", className)}
           style={{gridAutoRows: 'min-content'}}>

          {children}
      </div>
  )
}

export default BentoWrapper;
