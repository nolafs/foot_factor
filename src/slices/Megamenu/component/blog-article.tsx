'use client'
import React, {useEffect} from 'react';
import {filter} from '@prismicio/client';
import {createClient} from '@/prismicio';
import PostFeatureCard from '@/components/features/blog/postFeatureCard';


export const BlogArticle = ({size = 2, tags}: {size: number, tags?: string[]} ) => {

    const [resentPosts, setResentPosts] = React.useState<any[]>([]);

    useEffect(() => {
      const fetchPosts = async () => {
        const client = createClient();
        let filterList = [filter.at('my.posts.featured', true)]

        if(tags?.length) {
          filterList = [filter.any('my.posts.tags.tag', [...tags])];
        }


        const resentPosts = await client
            .getByType('posts', {
              pageSize: size,
              page: 0,
              filters: filterList,
              fetchLinks: ['author.name', 'author.profile_image', 'post_category.name'],
              orderings: [
                {
                  field: 'my.posts.publishing_date',
                  direction: 'desc',
                },
              ],
            })
            .then(response => {
              return response.results;
            });
        setResentPosts(resentPosts);
      }

      void fetchPosts();
    }, []);

  if (!resentPosts.length) {
    return null;
  }

  return (

          resentPosts.length && (
                  <div className={`mt-2 grid grid-cols-1 md:grid-cols-${size} gap-3 px-2`}>
                      {resentPosts.map(post => (
                          <PostFeatureCard key={post.uid} post={post} showExcerpt={false} showAuthor={false} />
                      ))}
                  </div>
          )

  )
}

export default BlogArticle;
