import { type RichTextField, type LinkField, type KeyTextField, type ImageField } from '@prismicio/client';

export type Cta = {
  label?: KeyTextField | string;
  heading: RichTextField | string;
  body?: RichTextField;
  links?: LinkField[];
  image?: ImageField;
  hasBooking?: boolean;
  telephone?: string;
  bookingLabel?: KeyTextField | string;
  dark?: boolean;
};
