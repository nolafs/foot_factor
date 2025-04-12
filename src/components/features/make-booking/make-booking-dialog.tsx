import React from 'react';
import {MakeBookingDocumentData} from '../../../../prismicio-types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

interface MakeBookingDialogProps {
    buttonLabel?: string
    makeBooking: MakeBookingDocumentData
}

export const MakeBookingDialog = ({makeBooking, buttonLabel = 'Book now'}: MakeBookingDialogProps) => {

  return (
      <Dialog>
          <DialogTrigger className={buttonVariants({variant: 'default', size: 'sm'})}>{buttonLabel} <CircleArrowRight
              className={'h-5 w-5'}/></DialogTrigger>
          <DialogContent className={'w-full max-w-7xl max-h-[975px] h-full'}>
              <DialogHeader>
                  <DialogTitle className={'font-heading text-2xl md:text-4xl lg:text-5xl'}>{makeBooking?.header || 'Make Booking'}</DialogTitle>
              </DialogHeader>
                     <ScrollArea className={'h-full max-h-[850px]'}>
                     <div className={'grid grid-cols-1 md:grid-cols-2 gap-5'}>
                       <div>
                        <BookingForm booking={makeBooking} />
                       </div>
                        <div className={'flex flex-col space-y-5'}>
                          {makeBooking?.call_to_actions.map((action, index) => (
                              <div
                                  key={index}
                                  className="flex flex-col space-y-2 sm:p-5 lg:p-8 rounded-xl text-primary-foreground bg-primary"
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
