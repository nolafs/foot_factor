import { type RichTextField, type LinkField, type KeyTextField, type ImageField } from '@prismicio/client';

export type Cta = {
  label?: KeyTextField | string;
  heading: RichTextField | KeyTextField | string;
  body?: RichTextField;
  links?: LinkField[];
  image?: ImageField;
  hasBooking?: boolean;
  telephone?: string;
  bookingLabel?: KeyTextField | string;
  dark?: boolean;
  comp?: string;
  wave?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'base';
};
