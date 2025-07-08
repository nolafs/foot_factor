'use client';
import {FC, useEffect, useState} from 'react';
import {Content} from '@prismicio/client';
import {PrismicRichText, SliceComponentProps} from '@prismicio/react';
import {createClient} from '@/prismicio';
import {Container} from '@/components/ui/container';
import {PrismicNextImage} from '@prismicio/next';
import {cn} from '@/lib/utils';
import {Heading} from '@/components/ui/text';

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

function createTestimonialGrid(testimonials: any[], columns = 4, groupsPerColumn = 2) {
  // Early return if testimonials is empty
  if (!testimonials || testimonials.length === 0) {
    return {featured: null, grid: []};
  }

  // Step 1: Remove the first testimonial and store as featured
  const [featured, ...rest] = testimonials;

  // If only one testimonial, return it as featured with empty grid
  if (rest.length === 0) {
    return {featured, grid: []};
  }

  // Step 2: Create columnGroups structure to match original
  const itemsPerColumn = Math.ceil(rest.length / columns);

  const grid = Array.from({length: columns}, (_, colIndex) => {
    const start = colIndex * itemsPerColumn;
    const end = start + itemsPerColumn;
    const columnItems = rest.slice(start, end);

    if (columnItems.length === 0) {
      return [];
    }

    // Split column items into groups (this creates the columnGroup structure)
    const groupSize = Math.ceil(columnItems.length / groupsPerColumn);

    return Array.from({length: groupsPerColumn}, (_, groupIndex) => {
      const groupStart = groupIndex * groupSize;
      const group = columnItems.slice(groupStart, groupStart + groupSize);
      return group;
    }).filter(group => group.length > 0);
  }).filter(columnGroup => columnGroup.length > 0);

  return {featured, grid};
}

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials: FC<TestimonialsProps> = ({slice}) => {

  const [testimonials, setTestimonials] = useState<Content.TestimonialDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const client = createClient();
        const data = await client.getByType(
            "testimonial",
            {
              pageSize: 10,
              orderings: [
                {
                  field: "my.testimonial.featured",
                  direction: "asc"
                },
                {
                  field: "my.testimonial.last_publication_date",
                  direction: "asc"
                }
              ]
            }
        )
        setTestimonials(data.results);
      } catch (err) {
        setError('Failed to fetch case studies');
        console.error('Error fetching case studies:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchCaseStudies();
  }, []);

  if (loading) {
    return (
        <Container as={'section'} padding={'lg'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
            <div className="text-center">Loading case studies...</div>
        </Container>
    );
  }

  if (error) {
    return (
        <Container as={'section'} padding={'lg'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
            <div className="text-center text-red-500">{error}</div>
        </Container>
    );
  }

  if (testimonials.length === 0 || !testimonials) {
    return (
        <Container as={'section'} padding={'lg'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
            <div className="text-center">No testimonials available.</div>
        </Container>
    );
  }

  const {featured, grid} = createTestimonialGrid(testimonials, 2, 2);

  console.log('Testimonials grid:', grid);

  return (
        <Container as={'section'} padding={"lg"} data-slice-type={slice.slice_type}
                   data-slice-variation={slice.variation} color={'accent'}>
          <Heading as={'h2'} className={'text-center content-master max-w-3xl mx-auto'}>
            <PrismicRichText field={slice.primary.heading}/>
          </Heading>
          <div
              className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm/6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">

            {/* Featured Testimonial */}
            {featured && (
                <figure
                    className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
                  <blockquote className="p-6 text-lg font-semibold tracking-tight text-gray-900 sm:p-8 sm:text-xl/8">
                    <PrismicRichText field={featured?.data?.quote}/>
                  </blockquote>
                  <figcaption
                      className="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-gray-900/10 px-6 py-4 sm:flex-nowrap">
                    <PrismicNextImage
                        field={featured?.data.client_profile_image}
                        className="size-10 flex-none rounded-full bg-gray-50"
                    />
                    <div className="flex-auto">
                      <div className="font-semibold">{featured?.data.client_name}</div>
                      <div className="text-gray-600">{`${featured?.data.activity}`}</div>
                    </div>
                  </figcaption>
                </figure>
            )}

            {/* Grid Columns */}
            {grid.map((columnGroup, columnGroupIdx) => (
                <div key={columnGroupIdx} className="space-y-8 xl:contents xl:space-y-0">
                  {columnGroup.map((column, columnIdx) => (
                      <div
                          key={columnIdx}
                          className={cn(
                              (columnGroupIdx === 0 && columnIdx === 0) ||
                              (columnGroupIdx === grid.length - 1 && columnIdx === columnGroup.length - 1)
                                  ? 'xl:row-span-2'
                                  : 'xl:row-start-1',
                              'space-y-8',
                          )}
                      >
                        {column.map((testimonial) => (
                            <figure
                                key={testimonial.id ?? testimonial.data.client_name}
                                className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                            >
                              <blockquote className="text-gray-900">
                                <PrismicRichText field={testimonial?.data?.quote}/>
                              </blockquote>
                              <figcaption className="mt-6 flex items-center gap-x-4">
                                <PrismicNextImage
                                    field={testimonial?.data.client_profile_image}
                                    className="size-10 rounded-full bg-gray-50"
                                />
                                <div>
                                  <div className="font-semibold">{testimonial.data.client_name}</div>
                                  <div className="text-gray-600">{`@${testimonial.data.activity}`}</div>
                                </div>
                              </figcaption>
                            </figure>
                        ))}
                      </div>
                  ))}
                </div>
            ))}
          </div>
        </Container>
  );
};

export default Testimonials;
