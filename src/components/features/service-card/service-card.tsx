
import React from 'react';
import {type FilledContentRelationshipField} from '@prismicio/client';
import {createClient} from '@/prismicio';
import {notFound} from 'next/navigation';
import {type ServicesDocumentData} from '../../../../prismicio-types';
import { PrismicRichText } from '@prismicio/react';
import MakeBookingDialog from '@/components/features/make-booking/make-booking-dialog';
import {PrismicNextLink} from '@prismicio/next';


interface ServiceCardProps{
    service: FilledContentRelationshipField
}

const getService = async (uid: string) => {
    if(!uid) {
        return null;
    }
    const client = createClient();
    const content = await client.getByID(uid).catch(() => notFound());
    return content.data as ServicesDocumentData;
}


export const ServiceCard = async ({service}:ServiceCardProps) =>{

    if(!service.uid) {
        return null;
    }


    const serviceData = await getService(service.id);

    return (
        <div className={'w-full p-8 bg-white rounded-4xl outline outline-1 outline-offset-[-1px] outline-primary-200 flex flex-col justify-stretch h-full items-start'}>
            <h3 className={'text-primary font-heading  flex flex-col text-xl sm:text-2xl  md:text-3xl lg:text-4xl'}>
                <div className={'font-medium  text-primary-200 text-base text-base sm:text-lg md:text-xl lg:text-2xl'}>Services</div>
                {serviceData?.price_heading}
            </h3>
            <div className={'font-medium mt-1 text-primary-300 text-lg sm:text-xl   md:text-2xl lg:text-3xl'}>From £{serviceData?.price}</div>

            <div className={'py-8 w-full mt-5 border-y border-primary-400 text-secondary text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-loose'}>{serviceData?.price_lead}</div>
            <div className={'prose py-5 flex-1 w-full text-secondary text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-loose'}>
                <PrismicRichText field={serviceData?.price_features} />
            </div>
            <div className={'w-full flex justify-center mt-5'}>
                <MakeBookingDialog size={'lg'} className={'w-full'}  />
            </div>
            <div className={'w-full flex justify-center mt-5'}>
                <PrismicNextLink field={serviceData?.telephone} className={'text-secondary  text-sm sm:text-base md:text-lg lg:text-xl'} />
            </div>

        </div>
    )
}

export default ServiceCard;
