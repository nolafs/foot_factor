'use client';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  LinkedinShareButton,
  LinkedinIcon,
} from 'next-share';
import cn from 'clsx';

interface SharePageProps {
  title: string | null | undefined;
  slug: string | null | undefined;
  route?: string;
  align?: 'center' | 'left' | 'right';
}

export function SharePage({ title,  slug, align = 'right', route = 'resources/blog'}: SharePageProps) {
  const titleToShare = `Check out: ${title}`;
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${route}/${slug}`;

  return (
    <ul className={cn('m-0 flex space-x-2 p-0', align === 'right' && 'items-end justify-end')}>
      <li>
        <FacebookShareButton url={shareUrl} quote={titleToShare} hashtag={'#footfactor'}>
          <FacebookIcon size={32} borderRadius={100} />
        </FacebookShareButton>
      </li>
      <li>
        <TwitterShareButton url={shareUrl} title={titleToShare} hashtags={['#footfactor']}>
          <TwitterIcon size={32} borderRadius={100} />
        </TwitterShareButton>
      </li>
      <li>
        <LinkedinShareButton url={shareUrl} title={titleToShare}>
          <LinkedinIcon size={32} borderRadius={100} />
        </LinkedinShareButton>
      </li>
    </ul>
  );
}

export default SharePage;
