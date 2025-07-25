import cn from 'clsx';
import {PrismicImage, PrismicRichText} from '@prismicio/react';
import {PrismicNextLink} from '@prismicio/next';
import React, {useEffect, useState} from 'react';
import {type NavigationElementDocumentData} from '@/prismic-types';
import { motion } from 'framer-motion';

export const NavigationMenuSubItem = ({item}: { item: NavigationElementDocumentData}) => {

  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [defaultActiveItem, setDefaultActiveItem] = useState<number | null>(null);

  // set default item active
  useEffect( () => {
    item.subs.forEach((subItem, idx) => {
      if (subItem.default) {
        setDefaultActiveItem(idx);
        setActiveItem(idx);
      }
    })
  }, []);

  useEffect(() => {
    if(activeItem === null && defaultActiveItem !== null) {
      setActiveItem(defaultActiveItem);
    }
  }, [activeItem, defaultActiveItem]);


  return (
      <div id={'nav-content'} className={cn('relative block w-full')}>
        <div className={'p-10'}>
        <div className={'grid grid-cols-8 gap-5 w-full'}>
          <div className={'col-span-5'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {item.subs.map((item, idx) => (
              <div
                  key={`main-nav-item-${idx}`}
                  onMouseEnter={() => setActiveItem(idx)}
                  onMouseLeave={() => setActiveItem(null)}
                  className="group relative flex item-center gap-x-5 mb-2 rounded-lg p-2 text-sm/6 transition-all duration-500 ease-in-out hover:bg-black">
                <div
                    className="aspect-1 flex size-8 items-center justify-center rounded-lg bg-black transition-all duration-300 ease-in-out group-hover:bg-white">
                  <PrismicImage
                      field={item.icon}
                      className="size-6 invert transition-all duration-300 ease-in-out group-hover:invert-0"
                  />
                </div>
                <PrismicNextLink
                    field={item.link}
                    className={'flex flex-col space-y-1'}
                    >
                    <div className={'text-base font-medium text-gray-800 transition-all group-hover:text-white'}>{item.label}</div>
                    <div className={'text-gray-400 transition-all group-hover:text-white'}>{item.subtitle}</div>
                  <span className="absolute inset-0"/>
                </PrismicNextLink>
              </div>
          ))}
            </div>
          </div>
          <div className={'col-span-3 relative'}>

              {item.subs.map((item, idx) => (

                  <motion.div className={'absolute inset-0'}

                              key={idx}
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: activeItem === idx ? 1 : 0, // Show/hide based on hover
                              }}
                  >
                    <div className={'relative'}>

                      <div
                          className={cn(`aspect-h-9 aspect-w-16 overflow-hidden rounded-xl  outline-1 -outline-offset-1`)}>
                        <PrismicImage field={item.image} className={'block size-full object-cover object-center'}/>
                      </div>
                      </div>
                      <div className={cn('absolute  bottom-0 right-2 w-3/4 p-4 rounded-md border border-transparent ' +
                          //'bg-[linear-gradient(115deg,var(--tw-gradient-stops))] from-[#baa2ecb3] from-[28%] via-[#00FAFEb3] via-[70%] to-[#2E5F9Ab3]' +
                          'backdrop-blur-lg bg-gray-100/40  shadow-md ring-1 ring-blue-950/15',
                      'after:absolute after:inset-0 after:rounded-md  after:shadow-[inset_0_0_2px_1px_#ffffff4d]') }>
                        <h3 className={'font-bold text-lg mb-2  text-black flex space-x-2'}>
                          <div
                              className={'aspect-1 size-6 flex items-center justify-center top-2 left-2 z-20 rounded-lg bg-black'}>
                            <PrismicImage field={item.icon} className={'size-4 invert'}/>
                          </div>

                          <span>{item.label}</span></h3>
                        <div className={'text-xs font-medium text-black/40'}>
                          <PrismicRichText field={item.description}/>
                        </div>
                      </div>

                  </motion.div>


                ))}

          </div>
        </div>
        </div>
      </div>
  )
}
