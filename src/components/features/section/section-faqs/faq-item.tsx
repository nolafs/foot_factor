'use client';
import { type KeyTextField, type RichTextField } from '@prismicio/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PrismicRichText } from '@prismicio/react';
import {CircleArrowDownIcon, CircleArrowUpIcon, MinusIcon, PlusIcon} from 'lucide-react';

interface FaqItemProps {
  heading: KeyTextField | null | undefined;
  body: RichTextField | null | undefined;
}

export function FaqItem({ heading, body }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={'border-b border-primary-950 pb-5 '}>
      <dt>
        <CollapsibleTrigger className={'w-full'}>
            <div className="flex w-full py-3 items-center justify-between text-primary-950 text-left font-medium leading-7 text-xl md:text-2xl lg:text-3xl">
              <span>
                <span className="sr-only">Toggle</span>
                <span>{heading}</span>
              </span>
              <span className={'text-right'}>
                {isOpen ? <MinusIcon size={36} strokeWidth={'1px'} /> : <PlusIcon size={36} strokeWidth={'1px'} />}
              </span>
            </div>

        </CollapsibleTrigger>
      </dt>

      <CollapsibleContent>
        <dd className="mt-5 px-8">
          <PrismicRichText field={body} />
        </dd>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default FaqItem;
