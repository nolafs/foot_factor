'use client'


import BookingForm from '@/components/features/make-booking/booking-form';
import { useBooking } from '@/lib/context/booking.context';

export const BookingFormWrapper = () => {

  const { bookingData } = useBooking();

  if (!bookingData) return null;

  return (<div className={'bg-white rounded-2xl p-5'}><BookingForm booking={bookingData} /></div>)

}

export default BookingFormWrapper;