'use client';
import {type FC} from 'react';
import {type Content, isFilled} from '@prismicio/client';
import {type SliceComponentProps} from '@prismicio/react';
import {Heading, Lead} from '@/components/ui/text';
import cn from 'clsx';
import {Container} from '@/components/ui/container';
import BlogArticle from '@/slices/Megamenu/component/blog-article';
import { PrismicNextLink} from '@prismicio/next';
import {buttonVariants} from '@/components/ui/button';
import { CircleArrowRight} from 'lucide-react';
import ServiceCard from '@/components/features/service-card/service-card';
import SliderDynamicList from '@/components/features/slider/slider-dynamic-list';
import ButtonRow from '@/components/ui/button-row';
import BentoTypeCard from '@/components/features/bento/bento-type-card';

/**
 * Props for `List`.
 */
export type ListProps = SliceComponentProps<Content.ListSlice>;

/**
 * Component for "List" Slices.
 */
const List: FC<ListProps> = ({ slice }) => {




  if (slice.variation === 'conditions') {

    return (<Container as={'section'} padding={'lg'} fullWidth={true} color={'accent'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>



        <div className={'max-w-3xl mx-auto text-center'}>
        <Heading as="h2" className={'mb-8 text-center'}>
          {slice.primary.heading}
        </Heading>

        <Lead className={'mb-8 text-center'}>
          {slice.primary.lead}
        </Lead>
        </div>

      <div className={'w-full pt-5 md:pt-8 lg:pt-16 pb-16 md:pb-24 lg:pb-28'}>
        <SliderDynamicList contentType={'condition'}

                           category={
                              slice.primary.category.link_type !== 'Any' && slice.primary.category.id  || undefined
                           }

                           tags={
                             slice.primary.tags
                                
                               ?.map(item => item.tag.link_type !== 'Any' && item.tag?.id)
                               .filter((id): id is string => typeof id === "string")
                             || undefined
                           }

                           size={'default'} baseUrl={'/conditions'}/>
      </div>

      <div className={'max-w-3xl mx-auto text-center'}>
        <Heading as="h3" className={'mb-8 text-center text-4xl lg:text-5xl'}>
          {slice.primary.footer_header}
        </Heading>

        <Lead className={'mb-8 text-center'}>
          {slice.primary.footer_body}
        </Lead>
        <div className={'w-full flex justify-center'}>
        <ButtonRow hasBooking={false} hasArrow={true} links={slice.primary.links} />
        </div>
      </div>
    </Container>)
  }


  if (slice.variation === 'guides') {
    return (<Container as={'section'} padding={'lg'} fullWidth={'true'} data-slice-type={slice.slice_type}
                       data-slice-variation={slice.variation} className={'py-16 md:py-24 lg:py-28'}>
      <Container as={'div'} color={'default'}>
        <Heading as="h2" className={'mb-8 text-center'}>
          {slice.primary.heading}
        </Heading>
      </Container>
      <div className={'w-full'}>
          <SliderDynamicList contentType={'guide'} size={'default'} baseUrl={'/resources/guides'} />
        </div>
    </Container>)
    }

  if (slice.variation === 'orthotics') {
    return (
        <Container as={'section'} padding={'lg'} fullWidth={'true'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className={'py-16 md:py-24 lg:py-28'}>
          <Container as={'div'} color={'default'}>
            <Heading as="h2" className={'text-center'}>
              {slice.primary.heading}
            </Heading>
          </Container>
          <div className={'w-full'}>
            <SliderDynamicList contentType={'orthotics'} size={'default'} baseUrl={'/services/orthotics'}/>
          </div>
        </Container>
    );
  }

    if (slice.variation === 'bento') {
      return <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
        <Container className={'lg:pt-28 pt-16 md:pt-24 text-center'}>
          <Heading as="h2" size={'xl'}>
            {slice.primary.heading}
          </Heading>
          <Lead size={'md'} className="mt-5 sm:mt-6 md:mt-8 lg:mt-10 max-w-3xl mx-auto">
            {slice.primary.lead}
          </Lead>
        </Container>
        <Container>
          {slice.primary.items.length > 0 && (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-6  grid-flow-row"
                   style={{gridAutoRows: 'min-content'}}>
                {slice.primary.items.map((item, idx) => (
                <div key={'bento-'+idx} className={cn("relative",
                    item.columns === '1' && 'col-span-6 lg:col-span-1',
                    item.columns === '2' && 'md:col-span-3 lg:col-span-2',
                    item.columns === '3' && 'md:col-span-3 lg:col-span-3',
                    item.columns === '4' && 'md:col-span-3 lg:col-span-4',
                    item.columns === '5' && 'md:col-span-3 lg:col-span-5',
                    item.columns === '6' && 'md:col-span-6 lg:col-span-6')}>

                  <div className={cn("relative flex  flex-col overflow-hidden max-lg:rounded-4xl lg:rounded-4xl",
                      item.card_height !== 'large' && 'md:h-[45vh] md:min-h-[520px] md:max-h-[650px]',
                      item.card_height === 'large' && 'md:h-[55vh] md:min-h-[650px] md:max-h-[820px]')}
                      style={{backgroundColor: item.color ?? 'transparent'}}
                  >

                    <BentoTypeCard item={item} />
                  </div>
                </div>
              ))}
              </div>

          )}
      </Container>

      </section>
    }

    if (slice.variation === 'pricingTable') {

      return (<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className={'bg-primary-50'}>
        <Container className={'lg:py-28 py-16 md:py-24'}>
          <hgroup>
            <div className={'flex w-full justify-between items-center gap-5 md:gap-8 lg:gap-10'}>
              <Heading as="h2" size={'xl'} className={'mb-8'}>
                {slice.primary.heading}
              </Heading>

            </div>
            <div className={'w-full md:max-w-4xl lg:max-w-3xl'}>
              <Lead size={'md'}>
                {slice.primary.lead}
              </Lead>
            </div>
          </hgroup>
          <div className={'mt-16'}>
            <div className={cn(`grid grid-cols-1 lg:grid-cols-${slice.primary.services.length} gap-5 md:gap-8 lg:gap-10 justify-stretch`)}>
            {slice.primary.services.map((item, index) => (
                (isFilled.contentRelationship(item.service)) && <div key={index}>
                 <ServiceCard  service={item.service} />
                </div>
            ))}
            </div>
          </div>

          {isFilled.link(slice.primary.link) && (
          <div className={'w-full flex justify-center mt-16'}>
            <PrismicNextLink field={slice.primary.link} className={buttonVariants({variant: 'outline'})}>
              {slice.primary.link.text} <CircleArrowRight className={'ml-2 h-4 w-4'}/>
            </PrismicNextLink>
          </div>
          )}
        </Container>


      </section>)
    }

    if(slice.variation === 'default') {
      return (

            <Container as={'section'} color={'accent'} padding={'lg'} data-slice-type={slice.slice_type}
                       data-slice-variation={slice.variation}>
              <hgroup>
                <div className={'flex w-full justify-between items-center gap-5 md:gap-8 lg:gap-10 mb-5 sm:mb-5 lg:mb-8'}>
                  <Heading as="h2" size={'xl'}>
                    {slice.primary.heading}
                  </Heading>
                  <div>
                    <PrismicNextLink field={slice.primary.link} className={buttonVariants({variant: 'default'})}>
                      {slice.primary.link.text} <CircleArrowRight className={'ml-2 h-4 w-4'}/>
                    </PrismicNextLink>
                  </div>
                </div>
                <div className={'w-full md:max-w-4xl lg:max-w-3xl'}>
                  <Lead size={'md'}>
                    {slice.primary.lead}
                  </Lead>
                </div>
              </hgroup>
              <div className={'mt-5 sm:mt-8 md:mt-10 lg:mt-16'}>
                <BlogArticle size={3}/>
              </div>
            </Container>
      );
    }

};

export default List;
