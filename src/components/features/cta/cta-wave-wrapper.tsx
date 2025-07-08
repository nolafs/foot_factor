import React from 'react';
import {Wave} from '@/components/wave';
import {Container} from '@/components/ui/container';

interface CallToActionWaveWrapperProps{
    children?: React.ReactNode;
    framed?: boolean;
}

export const CallToActionWaveWrapper = ({children,framed=false}:CallToActionWaveWrapperProps) =>{

    return (
        <div className="relative bg-primary-500 w-full pb-16 pt-20 text-center sm:py-24 overflow-hidden">
            <div className={'absolute w-full h-full top-0 left-0 flex items-center justify-center'}>
                <Wave/>
            </div>

            <Container className={'relative z-2'}>
                {children}
            </Container>
        </div>
    )
}

export default CallToActionWaveWrapper;
