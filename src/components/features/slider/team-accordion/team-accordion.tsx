'use client';
import React, {useState} from 'react';
import type {TeamCarouselSliceDefaultPrimaryMembersItem} from '@/prismic-types';
import {AnimatePresence, motion} from 'framer-motion';
import {PrismicRichText} from '@prismicio/react';
import {User} from 'lucide-react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {PrismicNextImage} from '@prismicio/next';
import {isFilled} from '@prismicio/client';
import TeamVideo from '@/components/features/slider/team-slider/team-video';

interface TeamAccordionProps {
    data: TeamCarouselSliceDefaultPrimaryMembersItem[]
}

export const TeamAccordion = ({data}: TeamAccordionProps) => {

    const [activeIndex, setActiveIndex] = useState(0);

  return (<div className={'flex flex-col items-center justify-center'}>
      <div className="flex w-full h-[70vh] bg-white overflow-hidden">
          {data.map((item, index) => {

              const isActive = activeIndex === index;

              return (
                  <motion.div
                      key={item.name}
                      className={`relative flex cursor-pointer`}
                      initial={false}
                      animate={{
                          width: isActive ? '65%' : '15%'
                      }}
                      transition={{
                          duration: 0.6,
                          ease: [0.32, 0.72, 0, 1]
                      }}
                      onClick={() => setActiveIndex(index)}
                  >
                      {/* Header */}
                    {/* Header */}
                    <div className="flex flex-col items-center justify-between w-16 bg-white  border-l-2 border-gray-200 p-4">
                      <div>
                        <PrismicNextImage field={item.photo} className="w-5 h-5 object-cover object-center rounded-full mb-2" />
                      </div>

                          <span className="text-sm font-medium text-primary whitespace-nowrap "
                                style={{writingMode: 'vertical-rl'}}>
                      {item.name}
                    </span>

                    </div>

                      {/* Content */}
                      <AnimatePresence>
                          {isActive && (
                              <motion.div
                                  initial={{opacity: 0, x: -20}}
                                  animate={{opacity: 1, x: 0}}
                                  exit={{opacity: 0, x: -20}}
                                  transition={{
                                      duration: 0.4,
                                      delay: 0.2
                                  }}
                                  className="flex-1 flex flex-col justify-center bg-white text-primary"
                              >
                                <ScrollArea className="h-full w-full overflow-y-auto border-l-2 border-gray-200 p-2">
                                  <div className="flex items-center">
                                      <h2 className="text-lg  font-bold">{item.name}</h2>
                                  </div>
                                  <div className={'prose prose-sm'}>
                                    <div className={'aspect-h-9 aspect-w-16 relative w-full mb-4 rounded-lg overflow-hidden'}>
                                      {isFilled.embed(item.video) ?
                                          <TeamVideo id={item.title ?? 'video'} title={item.title ?? ''} video={item.video}
                                                     image={item.photo} loading={'lazy'}/> :
                                          <PrismicNextImage field={item.photo}
                                                            className={'h-full w-full object-center object-cover'}/>}
                                    </div>
                                  <PrismicRichText field={item.bio} />
                                  </div>
                                </ScrollArea>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </motion.div>
              );
          })}
      </div>

    {/* Indicators */
    }
    <div className="flex justify-center mt-6 space-x-2">
        {data.map((_, index) => (
            <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                    activeIndex === index ? 'bg-white' : 'bg-gray-600'
                }`}
                whileHover={{scale: 1.2}}
                whileTap={{scale: 0.9}}
                onClick={() => setActiveIndex(index)}
            />
        ))}
    </div>
    </div>
  )
}

export default TeamAccordion;
