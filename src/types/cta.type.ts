import { type RichTextField, type LinkField, type KeyTextField, type ImageField } from '@prismicio/client';

export type Cta = {
  label?: KeyTextField | string;
  heading: KeyTextField | string;
  body?: RichTextField;
  links?: LinkField[];
  telephone?: string;
  image?: ImageField;
  dark?: boolean;
};
