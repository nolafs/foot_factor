import React from 'react';
import {Badge} from '@/components/ui/badge';
import {PrismicNextImage} from '@prismicio/next';
import dayjs from 'dayjs';
import {Link} from '@/components/ui/link';
import {PrismicRichText} from '@prismicio/react';
import type {ImageFieldImage} from '@prismicio/client';
import {PostsDocument} from 'prismicio-types';

interface PostFeatureCardProps {
    post: PostsDocument;
    showExcerpt?: boolean;
    showAuthor?: boolean;
}

export const PostFeatureCard = ({post, showExcerpt = true, showAuthor = true}: PostFeatureCardProps) => {

  return (
      <div
          key={post.uid}
          className="relative flex flex-col rounded-3xl bg-white p-2  ring-1 transition-all ring-black/5 group hover:shadow-md">
          {post.data.category && 'data' in post.data.category && (
              <div className="m absolute ml-3 mt-3">
                  <Badge>{(post.data.category.data as { name: string }).name}</Badge>
              </div>
          )}

          {post.data.feature_image && (<div className={'aspect-w-16 aspect-h-9'}>
              <PrismicNextImage
                  field={post.data.feature_image}
                  width={420}
                  height={235}
                  priority={true}
                  className={' w-full h-full rounded-2xl object-cover'}
                  imgixParams={{fm: 'webp', fit: 'crop', crop: ['focalpoint'], width: 420, height: 235, q: 70}}
              /></div>
          )}
          <div className="flex flex-1 flex-col p-8">
              <div className="text-sm/5 text-gray-700">
                  {dayjs(post.data.publishing_date).format('dddd, MMMM D, YYYY')}
              </div>
              <div className="mt-2 text-base/7 font-medium">
                  <Link href={`/resources/blog/${post.uid}`}>
                      <span className="absolute inset-0"/>
                      {post.data.title}
                  </Link>
              </div>
            { showExcerpt && (
              <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                  <PrismicRichText field={post.data.excerpt}/>
              </div>
            )}
            {showExcerpt && (
              post.data.author && 'data' in post.data.author && (
                  <div className="mt-6 flex items-center gap-3">
                      {post.data.author && (
                          <PrismicNextImage
                              alt=""
                              width={64}
                              height={64}
                              field={(post.data.author.data as { profile_image: ImageFieldImage }).profile_image}
                              className="aspect-square size-6 rounded-full object-cover"
                          />
                      )}
                      <div className="text-sm/5 text-gray-700">
                          {(post.data.author.data as { name: string }).name || 'Foot Factor'}
                      </div>
                  </div>
              ))}
          </div>
      </div>
  )
}

export default PostFeatureCard;
