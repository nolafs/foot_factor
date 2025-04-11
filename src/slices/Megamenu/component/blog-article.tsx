'use client'
import React, {useEffect} from 'react';
import {filter} from '@prismicio/client';
import {createClient} from '@/prismicio';
import PostFeatureCard from '@/components/features/blog/postFeatureCard';

interface BlogArticleProps {
}

export const BlogArticle = ({}: BlogArticleProps) => {

    const [resentPosts, setResentPosts] = React.useState<any[]>([]);

    useEffect(() => {
      const fetchPosts = async () => {
        const client = createClient();
        const resentPosts = await client
            .getByType('posts', {
              pageSize: 2,
              page: 0,
              filters: [filter.at('my.posts.featured', true)],
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

      fetchPosts()
      console.log('resentPosts', resentPosts);
    }, []);

  return (
      <div className={''}>
          {resentPosts.length && (
              <>
                  <h2 className="text-3xl font-medium tracking-tight">Featured Article</h2>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                      {resentPosts.map(post => (
                          <PostFeatureCard key={post.uid} post={post} showExcerpt={false} showAuthor={false} />
                      ))}
                  </div>
              </>
          )}
      </div>
  )
}

export default BlogArticle;
