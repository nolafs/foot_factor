import { type FC } from 'react';
import {type Content, isFilled} from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
import {Heading, Lead} from '@/components/ui/text';
import cn from 'clsx';
import {Container} from '@/components/ui/container';
import BlogArticle from '@/slices/Megamenu/component/blog-article';
import {PrismicNextImage, PrismicNextLink} from '@prismicio/next';
import {buttonVariants} from '@/components/ui/button';
import {ArrowRight, CircleArrowRight} from 'lucide-react';
import ServiceCard from '@/components/features/service-card/service-card';

/**
 * Props for `List`.
 */
export type ListProps = SliceComponentProps<Content.ListSlice>;

/**
 * Component for "List" Slices.
 */
const List: FC<ListProps> = async({ slice }) => {


    if (slice.variation === 'bento') {
      return <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
        <Container className={'lg:pt-28 pt-16 md:pt-24 text-center'}>
          <Heading as="h2">
            {slice.primary.heading}
          </Heading>
          <Lead className="mt-4 max-w-3xl mx-auto">
            {slice.primary.lead}
          </Lead>
        </Container>
        <Container className={'mt-5 lg:mt-16'}>
          {slice.primary.items.length > 0 && (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-6  grid-flow-row"
                   style={{gridAutoRows: 'min-content'}}>
                {slice.primary.items.map((item, idx) => (
                <div key={'bento-'+idx} className={cn("relative",
                    item.columns === '1' && 'lg:col-span-1',
                    item.columns === '2' && 'lg:col-span-2',
                    item.columns === '3' && 'lg:col-span-3',
                    item.columns === '4' && 'lg:col-span-4',
                    item.columns === '5' && 'lg:col-span-5',
                    item.columns === '6' && 'lg:col-span-6')}>

                  <div className={cn("relative flex  flex-col overflow-hidden max-lg:rounded-4xl lg:rounded-4xl",
                      item.card_height !== 'large' && 'h-[45vh]',
                      item.card_height === 'large' && 'h-[55vh]')}
                      style={{backgroundColor: item.color ?? 'transparent'}}
                  >

                    { item.card_type === '1' && (<>
                    <PrismicNextImage field={item.image} className={cn('w-full h-full object-cover')}/>
                      <div
                          className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary-950/90 to-transparent max-lg:rounded-4xl lg:rounded-4xl overflow-hidden"/>
                    <div className="absolute  z-5 bottom-0 p-7 md:p-10 lg:p-16  z-10 w-full">
                      <h3 className="text-white text-3xl">{item.heading}</h3>
                      <p className="mt-2 max-w-2xl text-lg text-white/90">
                        {item.lead}
                      </p>
                      {isFilled.link(item.link) && (<div className={'flex justify-end'}>
                        <PrismicNextLink field={item.link}
                                         className={cn(buttonVariants({variant: 'default', size: 'icon'}))}>
                          <ArrowRight className={'h-4 w-4'} strokeWidth={4}/>
                        </PrismicNextLink>
                      </div>
                      )}
                    </div>
                    </>)}

                    {item.card_type === '2' && (<>
                    <div className="p-7 md:p-10 lg:p-16 text-center">
                      {item.image_position === 'top' && (<div className={'w-full h-auto  mb-5'}>
                            <PrismicNextImage field={item.image} className={cn('w-full h-full object-cover')}/>
                          </div>
                      )}
                      <h3 className="text-3xl text-secondary">{item.heading}</h3>
                      <p className="mt-2 max-w-2xl text-lg text-gray-600">
                        {item.lead}
                      </p>
                    </div>

                          {item.image_position === 'bottom' && (<div className={'absolute bottom-0 w-full h-auto'}>
                              <PrismicNextImage field={item.image} className={cn('w-full h-full object-cover')}/>
                              </div>
                          )}
                    {isFilled.link(item.link) && (<div className={'absolute bottom-0 w-full p-7 md:p-10 lg:p-16 flex justify-end'}>
                          <PrismicNextLink field={item.link}
                                           className={cn(buttonVariants({variant: 'default', size:'icon'}))}>
                            <ArrowRight size={32} strokeWidth={4}/>
                          </PrismicNextLink>
                        </div>
                    )}
                    </>
                    )}
                  </div>
                </div>
              ))}
              </div>

          )}
      </Container>

      </section>
    }


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
