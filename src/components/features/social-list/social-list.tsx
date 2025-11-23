import SocialLink from './social-link';
import cn from 'clsx';

import { type SocialLinkItemType } from '@/types';

 
export interface SocialListProps {
  items?: SocialLinkItemType[];
  className?: string;
  icons?: boolean;
  variantButton?: number;
  variantList?: number;
}

const VARIANTS_BUTTON = [
  'w-[26px] h-[26px]',
  'h-[32px] w-[32px] !text-white !hover:text-white/80',
  '',
  'h-10 w-10 p-2.5 flex flex-col justify-center items-center border border-secondary rounded-full text-secondary hover:text-accent hover:border-accent',
];

const VARIANTS_LIST = [
  'flex space-x-6 justify-center items-center md:justify-end md:items-end',
  'flex flex-row space-x-3.5 md:space-x-7',
  'flex gap-4',
];

export function SocialList({ items, className, icons = true, variantButton = 0, variantList = 0 }: SocialListProps) {
  if (!items?.length) return null;
  return (
    <ul className={cn(className ?? VARIANTS_LIST[variantList])}>
      {items.map((item, id) => {
        return (
          item?.url && (
            <li key={id} className={'flex'}>
              <SocialLink item={item} icons={icons} className={VARIANTS_BUTTON[variantButton]} />
            </li>
          )
        );
      })}
    </ul>
  );
}

export default SocialList;
