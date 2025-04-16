import { FC } from 'react';
import {Content, isFilled} from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import {Heading, Lead} from '@/components/ui/text';
import cn from 'clsx';
import {Container} from '@/components/ui/container';
import BlogArticle from '@/slices/Megamenu/component/blog-article';

/**
 * Props for `List`.
 */
export type ListProps = SliceComponentProps<Content.ListSlice>;

/**
 * Component for "List" Slices.
 */
const List: FC<ListProps> = ({ slice }) => {




    return (
        <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className={'bg-accent-50'}>
          <Container className={'lg:py-28 py-16 md:py-24'}>
            <header>
              <Heading as="h2" className={'mb-8'}>
                {slice.primary.heading}
              </Heading>
              <div className={'w-full md:max-w-4xl lg:max-w-3xl'}>
                <Lead>
                  {slice.primary.lead}
                </Lead>
              </div>
            </header>
            <div className={'mt-16'}>
              <BlogArticle size={3} />
            </div>
          </Container>
        </section>
    );

};

export default List;
