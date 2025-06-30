import { type RichTextField, type LinkField, type KeyTextField, type ImageField } from '@prismicio/client';

export type Cta = {
  label?: KeyTextField | string;
  heading: RichTextField;
  body?: RichTextField;
  links?: LinkField[];
  image?: ImageField;
  hasBooking?: boolean;
  bookingLabel?: KeyTextField | string;
  dark?: boolean;
};
