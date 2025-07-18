import React from 'react';
import BentoWrapper from '@/components/features/bento/bento-wrapper';
import BentoCard from '@/components/features/bento/bento-card';
import Link from 'next/link';
import {PrismicNextImage} from '@prismicio/next';
import {Container} from '@/components/ui/container';
import {ConditionCategoryDocument} from '@/prismic-types';
import {buttonVariants} from '@/components/ui/button';
import {AutoComplete} from '@/components/features/search/autocomplete';

interface SearchConditionsProps {
    conditionCategories?: ConditionCategoryDocument[]
}

export const SearchConditions = ({conditionCategories}: SearchConditionsProps) => {

  return (<Container as={'section'} padding={'lg'}>

    <AutoComplete />

      <BentoWrapper className={'!mt-0 isolate'}>
        {conditionCategories?.map((category, idx) => (
            <BentoCard key={'condition_'+ category.id} columns={Math.floor(idx / 2) % 2 === 0 ? (idx % 2 === 0 ? 4 : 2) : (idx % 2 === 0 ? 2 : 4)}>
              <Link href={'/conditions/' + category.uid} className={'group'}>
                <div className={'relative bg-secondary w-full h-full flex overflow-hidden rounded-3xl max-lg:rounded-4xl lg:rounded-4xl'}>
                  {category.data.image && (
                      <PrismicNextImage field={category.data.image} className="h-full w-full object-cover transition-all ease-in-out   group-hover:scale-125" />
                  )}
                  {!category.data.card_style || category.data.card_style === 'default' && (<>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary-950/90 to-transparent max-lg:rounded-4xl lg:rounded-4xl overflow-hidden"/>
                  <div className={'absolute bottom-0 w-full p-7 md:p-10 lg:p-10 flex flex-col z-10'}>
                  <h3 className={'text-white mb-1 font-semibold text-3xl md:text-4xl lg:text-5xl group-hover:text-accent transition-all ease-in-out '}>{category.data.name}</h3>
                    <p className={'text-primary-300 text-sm md:text-sm xl:text-xl leading-tight'}>{category.data.description}</p>
                  </div>
                  </> )}

                  {category.data.card_style && category.data.card_style === 'left' && (<>
                    <div className={'absolute bottom-0 w-full md:w-7/12 p-7 md:p-10 lg:p-10 flex flex-col z-10'}>
                      <h3 className={'text-primary font-semibold text-3xl md:text-4xl lg:text-5xl'}>{category.data.name}</h3>
                      <p className={'text-primary-700 text-sm md:text-sm xl:text-xl leading-tight'}>{category.data.description}</p>
                    </div>
                  </>)}

                  {category.data.card_style && category.data.card_style === 'center' && (<>
                    <div className={'absolute top-0 left-0 w-full h-full text-center p-7 md:p-10 lg:p-10 flex flex-col justify-center  z-10'}>
                      <div className={'flex justify-center mb-4'}>
                        <svg width="101" height="101" viewBox="0 0 101 101" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="100" height="100" rx="50" fill="#00263E"/>
                          <path
                              d="M47.6731 26.5C45.52 26.5 43.5908 28.1696 43.2911 30.2924L37.6464 70.2757C37.3231 72.5659 39.0114 74.4995 41.3344 74.4995C43.4875 74.4995 45.4167 72.8299 45.7164 70.7071L50.8257 34.5162H71.5783C73.7314 34.5162 75.6606 32.8466 75.9603 30.7238C76.2836 28.4336 74.5953 26.5 72.2723 26.5H47.6731Z"
                              fill="white"/>
                          <path
                              d="M52.3879 47.5624C52.6335 45.8223 54.2339 44.4372 55.999 44.4372H69.4578C71.3077 44.4372 72.6323 45.9543 72.3748 47.7781C72.1291 49.5182 70.5287 50.9033 68.7637 50.9033H58.4748L55.5847 71.3748C55.3391 73.1149 53.7386 74.5 51.9736 74.5C50.1237 74.5 48.7991 72.983 49.0566 71.1591L52.3879 47.5624Z"
                              fill="white"/>
                          <path
                              d="M28.3172 44.5534C26.4852 44.5534 25 46.032 25 47.8559C25 49.6798 26.4851 51.1584 28.3171 51.1584H33.6245C35.4566 51.1584 36.9417 49.6798 36.9417 47.8559C36.9418 46.032 35.4566 44.5534 33.6246 44.5534H28.3172Z"
                              fill="white"/>
                        </svg>

                      </div>
                      <h3 className={'text-primary font-semibold text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-5 leading-snug'}>{category.data.name}</h3>
                      <Link href={'/conditions/' + category.uid} className={buttonVariants({variant: 'default', size: 'sm'})}>
                        Other Conditions
                      </Link>

                    </div>
                  </>)}
                </div>
              </Link>
            </BentoCard>
        ))}
      </BentoWrapper>
  </Container>)
}

export default SearchConditions;
