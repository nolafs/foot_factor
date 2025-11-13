import React from 'react';
import {Wave} from '@/components/wave';
import {Container} from '@/components/ui/container';
import {cn} from '@/lib/utils';

interface CallToActionWaveWrapperProps{
    children?: React.ReactNode;
    framed?: boolean;
    className?: string;
    textAlign?: 'left' | 'center' | 'right';
}

export const CallToActionWaveWrapper = ({children,framed=false, textAlign = 'center', className}:CallToActionWaveWrapperProps) =>{

    return (
        <div className={cn("relative bg-primary-500 w-full pb-16 pt-20 text-center sm:py-24 overflow-hidden",
            textAlign === 'left' && 'text-left',
            textAlign === 'right' && 'text-right',
            textAlign === 'center' && 'text-center',
            framed && 'border border-primary-600 rounded-2xl mx-auto max-w-2xl lg:max-w-8xl',
            className )}>
            <div className={'absolute inset-0 w-full h-full overflow-hidden'}>
                <Wave />
            </div>

            <Container className={'relative z-2'}>
                {children}
            </Container>
        </div>
    )
}

export default CallToActionWaveWrapper;
