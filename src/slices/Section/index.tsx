import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import SectionDefault from '@/components/features/section/section-default/section-default';
import SectionContentWithButton
  from '@/components/features/section/section-content-with-button/section-content-with-button';
import SectionContentColumnWithImage
  from '@/components/features/section/section-content-column-with-image/section-content-with-button';
import { Container } from '@/components/ui/container';

/**
 * Props for `Section`.
 */
export type SectionProps = SliceComponentProps<Content.SectionSlice>;

/**
 * Component for "Section" Slices.
 */
const Section: FC<SectionProps> = ({ slice }) => {

  console.log('slice', slice.variation)

  if (slice.variation === 'contentWithImageColumnList') {

    console.log('contentWithImageColumnList')

    return(
    <section>
      <Container className={'pt-16 md:pt-24 lg:pt-32 pb-5 md:pb-10 lg:pb-16'}>
      <header>
        <h2 className={'text-center mx-auto max-w-4xl font-heading font-medium text-2xl md:text-4xl lg:text-5xl'}>{slice.primary.heading}</h2>
      </header>
      </Container>
      {(slice.primary.list.length) && slice.primary.list.map ( (item, index) => (

          <SectionContentColumnWithImage
              as="div"
              heading={item.heading}
              body={item.body}
              image={item.image}
              color={item.color}

          />)

    )}
    </section>
    )
  }

  if (slice.variation === 'contentWithImageColumn') {
    return (
        <SectionContentColumnWithImage
            heading={slice.primary.heading}
            body={slice.primary.body}
            image={slice.primary.image}
            color={slice.primary.color}

        />
    );
  }


  if(slice.variation === 'contentWithLeadButtons') {
    return (
        <SectionContentWithButton
            heading={slice.primary.heading}
            subheading={slice.primary.subheading}
            body={slice.primary.body}
            links={slice.primary.links}
            hasBooking={slice.primary.has_booking}
            bookingLabel={slice.primary.booking_label}
        />
    );
  }

  if(slice.variation === 'default') {
    return (
        <SectionDefault heading={slice.primary.heading} body={slice.primary.body} animated={slice.primary.animated}/>
    );
  }
};

export default Section;
