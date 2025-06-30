import { FC } from 'react';
import {Content, isFilled} from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import {Heading, Lead} from '@/components/ui/text';
import cn from 'clsx';
import {Container} from '@/components/ui/container';
import BlogArticle from '@/slices/Megamenu/component/blog-article';
import {PrismicNextLink} from '@prismicio/next';
import {buttonVariants} from '@/components/ui/button';
import {CircleArrowRight} from 'lucide-react';
import ServiceCard from '@/components/features/service-card/service-card';

/**
 * Props for `List`.
 */
export type ListProps = SliceComponentProps<Content.ListSlice>;

/**
 * Component for "List" Slices.
 */
const List: FC<ListProps> = async({ slice }) => {


    if (slice.variation === 'pricingTable') {

      if(slice.primary.services.length){
        console.log('slice', slice.primary.services)
      }

      return (<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className={'bg-primary-50'}>
        <Container className={'lg:py-28 py-16 md:py-24'}>
          <hgroup>
            <div className={'flex w-full justify-between items-center gap-5 md:gap-8 lg:gap-10'}>
              <Heading as="h2" className={'mb-8'}>
                {slice.primary.heading}
              </Heading>

            </div>
            <div className={'w-full md:max-w-4xl lg:max-w-3xl'}>
              <Lead>
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
          <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className={'bg-accent-50'}>
            <Container className={'lg:py-28 py-16 md:py-24'}>
              <hgroup>
                <div className={'flex w-full justify-between items-center gap-5 md:gap-8 lg:gap-10'}>
                  <Heading as="h2" className={'mb-8'}>
                    {slice.primary.heading}
                  </Heading>
                  <div>
                    <PrismicNextLink field={slice.primary.link} className={buttonVariants({variant: 'default'})}>
                      {slice.primary.link.text} <CircleArrowRight className={'ml-2 h-4 w-4'}/>
                    </PrismicNextLink>
                  </div>
                </div>
                <div className={'w-full md:max-w-4xl lg:max-w-3xl'}>
                  <Lead>
                    {slice.primary.lead}
                  </Lead>
                </div>
              </hgroup>
              <div className={'mt-16'}>
                <BlogArticle size={3}/>
              </div>
            </Container>
          </section>
      );
    }

};

export default List;
