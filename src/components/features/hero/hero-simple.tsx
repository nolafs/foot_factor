import { Wave } from '@/components/wave';
import React from 'react';
import {type KeyTextField} from '@prismicio/client';
import {Container} from '@/components/container';
import {Heading, Lead, Subheading} from '@/components/ui/text';

interface HeroSimpleProps {
    wave_type:  'default' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
    label?: KeyTextField | string;
    heading?: KeyTextField | string;
    subheading?: KeyTextField | string;

}

export const HeroSimple = ({wave_type, subheading, heading, label}: HeroSimpleProps) => {

    return (<div
            className={'relative isolate bg-gradient-to-r from-primary-300 to-primary-300/0  pb-24 pt-24 md:pb-40 md:pt-52  overflow-hidden'}>
            <div className={'absolute w-full h-full top-0 left-0 flex items-center justify-center'}>
                <Wave
                    waveType={
                        wave_type === 'default'
                            ? 'type_1'
                            : (['1', '2', '3', '4', '5', '6', '7', '8'] as const).includes(wave_type)
                                ? `type_${wave_type}`
                                : undefined
                    }
                />
            </div>
            <div
                className={'absolute z-1 bg-gradient-to-r from-primary-300 to-primary-300/0  w-full h-full top-0 left-0'}/>


            <Container className={'relative z-20'}>
                {label?.length && (
                    <Subheading className="mt-16">{label}</Subheading>
                )}
                <Heading as="h1" className="mt-2">
                    {heading}
                </Heading>
                <Lead className="mt-6 max-w-3xl">{subheading}</Lead>
            </Container>
        </div>
    );
}

export default HeroSimple;
