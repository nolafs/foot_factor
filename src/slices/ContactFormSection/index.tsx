import { type FC } from 'react';
import { type Content } from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
import {Container} from '@/components/ui/container';
import SectionColumns from '@/components/features/section/section-columns';
import ContactForm from '@/components/features/contact-form/contact-form';

/**
 * Props for `ContactFormSection`.
 */
export type ContactFormSectionProps = SliceComponentProps<Content.ContactFormSectionSlice>;

/**
 * Component for "ContactFormSection" Slices.
 */
const ContactFormSection: FC<ContactFormSectionProps> = ({ slice }) => {
  return (
    <Container padding={'lg'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <SectionColumns columnSize={'small'} heading={slice.primary.heading} classNames={'prose prose-lg'}>
        <ContactForm  items={slice.primary.items ?? []} />
      </SectionColumns>
    </Container>
  );
};

export default ContactFormSection;
