'use client';
import {type GuideDocumentData, type PostsDocumentData} from '../../../../prismicio-types';
import { type Author } from '@/types';
import cn from 'clsx';
import AuthorLink from '@/components/features/author/author-link';
import SharePage from '@/components/features/share-page/share-page';
import React from 'react';
import Link from 'next/link';

type PostAsideProps = {
  as?: keyof JSX.IntrinsicElements;
  uid?: string;
  post: Partial<PostsDocumentData> | Partial<GuideDocumentData>;
  author?: Author;
  url?: string;
  classNames?: string;
  onNavigate?: () => void;
  shareRoute?: string;
};

const getPostTitle = (post: Partial<PostsDocumentData> | Partial<GuideDocumentData>): string => {
  if ('title' in post && post.title) return post.title;
  if ('name' in post && post.name) return post.name;
  return '';
};

const hasTitle = (post: Partial<PostsDocumentData> | Partial<GuideDocumentData>): boolean => {
  return ('title' in post && !!post.title) || ('name' in post && !!post.name);
};

export const PostAside = ({
  as: Component = 'div',
  uid,
  post,
  author,
  url = 'blog',
  classNames,
  onNavigate,
  shareRoute = 'resources/blog',
}: PostAsideProps) => {
  return (
    <Component className={cn('flex flex-wrap items-start justify-between gap-10 md:divide-x divide-primary-200', classNames)}>
      {post.category && (
        <div className="flex flex-col flex-wrap gap-2 px-5">
          <span className="text-sm font-medium text-gray-500">Category:</span>
          <Link
            key="test"
            onClick={onNavigate}
            href={`/blog?category=${
              post.category &&
              'data' in post.category &&
              (
                post.category.data as {
                  uid: string;
                }
              ).uid
            }`}
            className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-sm/6 font-medium text-gray-500">
            {post.category && 'data' in post.category && (post.category.data as { name: string }).name}
          </Link>
        </div>
      )}
      {author && (
        <div className="flex flex-col flex-wrap gap-2 px-5">
          <span className="text-sm font-medium text-gray-500">Author:</span>
          <span className={'text-gray-700'}>
            <AuthorLink author={author} />
          </span>
        </div>
      )}

      {post.tags && (
        <div className="flex flex-wrap gap-2 md:flex-col px-5">
          <span className="text-sm font-medium text-gray-500">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((item, idx) => (
              <Link
                onClick={onNavigate}
                href={`/${url}?tags=` + (item && 'tag' in item && (item.tag as { uid: string }).uid)}
                key={'tags-' + idx}
                className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-sm/6 font-medium capitalize text-gray-500">
                {item && 'tag' in item && (item.tag as { data: { name: string } }).data?.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      {uid && (
        <div className="flex flex-col flex-wrap gap-2 px-5">
          <div className="mb-2 text-sm font-medium text-gray-500">Share:</div>
          {post && hasTitle(post) &&
		        <SharePage
			        slug={uid}
			        title={getPostTitle(post)}
			        route={shareRoute}
		        />
          }
        </div>
      )}
    </Component>
  );
};

export default PostAside;
