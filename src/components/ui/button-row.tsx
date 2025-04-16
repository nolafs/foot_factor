import React from 'react';
import MakeBookingDialog from '@/components/features/make-booking/make-booking-dialog';
import ButtonSliceVariation from '@/components/ui/button-slice-variation';
import {LinkField} from '@prismicio/client';

interface ButtonRowProps {
  hasBooking?: boolean;
  bookingLabel?: string;
  links?: LinkField[];
  hasArrow?: boolean;

}

export const ButtonRow = ({links, hasBooking, bookingLabel = 'Book now', hasArrow = false}: ButtonRowProps) => {

  return (
    <div className="mt-12 flex flex-col gap-x-3 gap-y-4 sm:flex-row">
      {hasBooking && <MakeBookingDialog size={'lg'} buttonLabel={bookingLabel}/>}
      {links?.map(link => (
          <ButtonSliceVariation
              hasArrow={hasArrow}
              key={
                link.text ? link?.text.toLowerCase().replace(/ /g, '-') : Math.random().toString(36).substring(2, 15)
              }
              link={link}
          />
      ))}
    </div>
  );
}

export default ButtonRow;
