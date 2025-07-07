import React, {useEffect, useState} from 'react';
import {type FilledContentRelationshipField} from '@prismicio/client';
import {createClient} from '@/prismicio';
import {type ServicesDocumentData} from '@/prismic-types';
import {PrismicRichText} from '@prismicio/react';
import MakeBookingDialog from '@/components/features/make-booking/make-booking-dialog';
import {PrismicNextLink} from '@prismicio/next';

interface ServiceCardProps {
  service: FilledContentRelationshipField;
}

const getService = async (uid: string) => {
  if (!uid) {
    return null;
  }
  const client = createClient();
  try {
    const content = await client.getByID(uid);
    return content.data as ServicesDocumentData;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
};

export const ServiceCard = ({service}: ServiceCardProps) => {
  const [serviceData, setServiceData] = useState<ServicesDocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!service.uid) {
        setLoading(false);
        return;
      }

      try {
        const data = await getService(service.id);
        setServiceData(data);
      } catch (err) {
        setError('Failed to load service data');
        console.error('Error fetching service data:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchServiceData();
  }, [service.id, service.uid]);

  if (!service.uid) {
    return null;
  }

  if (loading) {
    return (
        <div
            className={'w-full p-8 bg-white rounded-4xl outline outline-1 outline-offset-[-1px] outline-primary-200 flex flex-col justify-center h-full items-center'}>
          <div className="text-primary-300">Loading service...</div>
        </div>
    );
  }

  if (error || !serviceData) {
    return (
        <div
            className={'w-full p-8 bg-white rounded-4xl outline outline-1 outline-offset-[-1px] outline-primary-200 flex flex-col justify-center h-full items-center'}>
          <div className="text-red-500">{error ?? 'Service not found'}</div>
        </div>
    );
  }

  return (
      <div
          className={'w-full p-8 bg-white rounded-4xl outline outline-1 outline-offset-[-1px] outline-primary-200 flex flex-col justify-stretch h-full items-start'}>
        <h3 className={'text-primary font-heading flex flex-col text-xl sm:text-2xl md:text-3xl lg:text-4xl'}>
          <div className={'font-medium text-primary-200 text-base sm:text-lg md:text-xl lg:text-2xl'}>
            Services
          </div>
          {serviceData?.price_heading}
        </h3>
        <div className={'font-medium mt-1 text-primary-300 text-lg sm:text-xl md:text-2xl lg:text-3xl'}>
          From £{serviceData?.price}
        </div>

        <div
            className={'py-8 w-full mt-5 border-y border-primary-400 text-secondary text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-loose'}>
          {serviceData?.price_lead}
        </div>
        <div
            className={'prose py-5 flex-1 w-full text-secondary text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-loose'}>
          <PrismicRichText field={serviceData?.price_features}/>
        </div>
        <div className={'w-full flex justify-center mt-5'}>
          <MakeBookingDialog size={'lg'} className={'w-full'}/>
        </div>
        <div className={'w-full flex justify-center mt-5'}>
          <PrismicNextLink
              field={serviceData?.telephone}
              className={'text-secondary text-sm sm:text-base md:text-lg lg:text-xl'}
          />
        </div>
      </div>
  );
};

export default ServiceCard;
