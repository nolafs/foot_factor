'use client';
import { MakeBookingDocumentData } from 'prismicio-types';
import React, {createContext, useContext, useState, ReactNode} from 'react';


interface BookingContextType {
  bookingData: MakeBookingDocumentData | null;
  setBookingData: (data: MakeBookingDocumentData) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({children, initialData}: {
  children: ReactNode;
  initialData: MakeBookingDocumentData | null
}) => {
  const [bookingData, setBookingData] = useState<MakeBookingDocumentData | null>(initialData);

  return (
      <BookingContext.Provider value={{bookingData, setBookingData}}>
        {children}
      </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
