'use client';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {buttonVariants} from '@/components/ui/button';
import {CircleArrowRight} from 'lucide-react';
import {PrismicRichText} from '@prismicio/react';
import {PrismicNextLink} from '@prismicio/next';
import BookingForm from './booking-form';
import {ScrollArea} from '@/components/ui/scroll-area';
import { useBooking } from '@/lib/context/booking.context';
import { cn } from '@/lib/utils';

interface MakeBookingDialogProps {
    buttonLabel?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const MakeBookingDialog = ({ buttonLabel = 'Book now', size = 'sm', className}: MakeBookingDialogProps) => {

  const { bookingData } = useBooking();

  const mappedSize = size === 'md' ? 'lg' : size

  if (!bookingData) {
    return null;
  }

  return (
      <Dialog>
          <DialogTrigger className={cn(buttonVariants({variant: 'default', size: mappedSize}), className)}>{buttonLabel} <CircleArrowRight size={mappedSize === 'sm' ? 5 : 30}/></DialogTrigger>
          <DialogContent className={'w-full max-w-7xl max-h-[975px] h-full'}>
              <DialogHeader>
                  <DialogTitle className={'font-heading text-2xl md:text-4xl lg:text-5xl'}>{bookingData?.header ?? 'Make Booking'}</DialogTitle>
              </DialogHeader>
                     <ScrollArea className={'h-full max-h-[850px]'}>
                     <div className={'grid grid-cols-1 md:grid-cols-2 gap-5'}>
                       <div>
                        <BookingForm booking={bookingData} />
                       </div>
                        <div className={'flex flex-col space-y-5'}>
                          {bookingData?.call_to_actions.map((action, index) => (
                              <div
                                  key={index}
                                  className="flex flex-col space-y-2 p-3 sm:p-5 lg:p-8 rounded-xl text-primary-foreground bg-primary"
                              >
                                <h3 className="font-normal font-heading text-lg md:text-xl lg:text-3xl">
                                  {action.header}
                                </h3>
                                <div className={'text-slate-300 text-sm md:text-base lg:text-lg'}>
                                <PrismicRichText field={action.body} />
                                </div>
                                {action.link && (
                                    <div className="w-full flex justify-end">
                                      <PrismicNextLink
                                          field={action.link}
                                          className={buttonVariants({variant: 'default', size: 'sm'})}
                                      >
                                        {action.link.text}
                                        <CircleArrowRight
                                            className={'h-5 w-5'}/>
                                      </PrismicNextLink>
                                    </div>
                                )}
                              </div>
                          ))}
                        </div>
                     </div>
                     </ScrollArea>

          </DialogContent>
      </Dialog>
  )
}

export default MakeBookingDialog;
