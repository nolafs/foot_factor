import * as prismic from '@prismicio/client';
import { algoliasearch } from 'algoliasearch';
import config from '../../../../slicemachine.config.json';
import { type PostsDocument } from '@/prismic-types';
import {asText} from '@prismicio/client';

const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT ?? config.repositoryName;

export async function POST() {
  // Check if Algolia credentials exist, return error if not
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID || !process.env.ALGOLIA_ADMIN_KEY) {
    return new Response('Algolia credentials are not set', {
      status: 500,
    });
  }

  try {
    // Instantiate Prismic and Algolia clients
    const client = prismic.createClient(repositoryName);
    const algoliaClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_KEY);

    // Get all articles from Prismic
    const articles: PostsDocument[] = await client.getAllByType('posts', {
      fetchLinks: ['author.name', 'author.profile_image', 'post_category.name', 'post_tags, post_tags.name'],
    });

    // Map articles to Algolia records
    const articleRecords = articles.map(post => ({
      objectID: post.id, // Unique identifier in algolia
      title: post.data.title, // Post title
      type: 'article', // Post type
      slug: `/resources/blog/${post.uid}`,
      featured: post.data.featured,
      author:
        (post.data.author && 'data' in post.data.author && (post.data.author.data as { name: string }).name) ||
        'Foot Factor',
      category:
        post.data.category && 'data' in post.data.category && (post.data.category.data as { name: string }).name,
      tags: post.data.tags.map(item => {
        const slug = item && 'tag' in item && (item.tag as { uid: string }).uid;
        const name = item && 'tag' in item && (item.tag as { data: { name: string } }).data?.name;

        return {
          slug,
          name,
        };
      }), // Post category
      image: post.data.feature_image, // Post featured image
      excerpt: post.data.excerpt, // Post excerpt
      text: asText(post.data.content).slice(0, 5000), // Post content transformed to search text
    }));

    // Index records to Algolia
    await algoliaClient.saveObjects({ indexName: 'blog', objects: articleRecords });
    await algoliaClient.saveObjects({ indexName: 'global', objects: articleRecords });

    //Conditions

    // Get all articles from Prismic
    const conditions = await client.getAllByType('condition', {
      fetchLinks: ['author.name', 'author.profile_image', 'condition_category.name'],
    });

    // Map articles to Algolia records
    const conditionRecords = conditions.map(post => ({
      objectID: post.id, // Unique identifier in algolia
      title: post.data.title, // Post title
      type: 'condition', // Post type
      slug: `/conditions/${(post.data.category as { slug: string }).slug}/${post.uid}`, // Post URL slug
      featured: post.data.featured,
      author:
        (post.data.author &&
          'data' in post.data.author &&
          (
            post.data.author.data as {
              name: string;
            }
          ).name) ||
        'Foot Factor',
      category:
        post.data.category && 'data' in post.data.category && (post.data.category.data as { name: string }).name,
      tags: post.data.tags.map(item => {
        const slug = item && 'tag' in item && (item.tag as { uid: string }).uid;
        const name = item && 'tag' in item && (item.tag as { data: { name: string } }).data?.name;

        console.log(item);

        return {
          slug,
          name,
        };
      }),
      image: post.data.feature_image, // Post featured image
      text: post.data?.excerpt?.slice(0, 5000) ?? post.data?.title ?? '' , // Post content transformed to search text
    }));

    // Index records to Algolia
    await algoliaClient.saveObjects({ indexName: 'conditions', objects: conditionRecords });
    await algoliaClient.saveObjects({ indexName: 'global', objects: conditionRecords });

    // Get all articles from Prismic
    const guides = await client.getAllByType('guide', {
      fetchLinks: ['author.name', 'author.profile_image', 'condition_category.name'],
    });

    // Map articles to Algolia records
    const guideRecords = guides.map(post => ({
      objectID: post.id, // Unique identifier in algolia
      title: post.data.name, // Post title
      type: 'guide', // Post type
      slug: `/resources/guides/${post.uid}`, // Post URL slug
      featured: post.data.featured,
      author:
          (post.data.author &&
              'data' in post.data.author &&
              (
                  post.data.author.data as {
                    name: string;
                  }
              ).name) ||
          'Foot Factor',
      category:
          post.data.category && 'data' in post.data.category && (post.data.category.data as { name: string }).name,
      tags: post.data.tags.map(item => {
        const slug = item && 'tag' in item && (item.tag as { uid: string }).uid;
        const name = item && 'tag' in item && (item.tag as { data: { name: string } }).data?.name;

        console.log(item);

        return {
          slug,
          name,
        };
      }),
      image: post.data.feature_image, // Post featured image
      text: post.data?.description?.slice(0, 5000) ?? post.data?.name ?? '', // Post content transformed to search text
    }));

    // Index records to Algolia
    await algoliaClient.saveObjects({indexName: 'global', objects: guideRecords});

    // Get all articles from Prismic
    const orthotics = await client.getAllByType('orthotics', {
      fetchLinks: ['post_category.name'],
    });

    // Map articles to Algolia records
    const orthoticRecords = orthotics.map(post => ({
      objectID: post.id, // Unique identifier in algolia
      title: post.data.heading, // Post title
      type: 'orthotics', // Post type
      slug: `/services/orthotics/${post.uid}`, // Post URL slug
      featured: true,
      author: 'Foot Factor',
      category:
          post.data.category && 'data' in post.data.category && (post.data.category.data as { name: string }).name,
      tags: 'service',
      image: post.data.image, // Post featured image
      text: post.data?.description?.slice(0, 5000) ?? post.data?.meta_description ?? '', // Post content transformed to search text
    }));

    // Index records to Algolia
    await algoliaClient.saveObjects({indexName: 'global_pages', objects: orthoticRecords});

    // Get all articles from Prismic
    const services = await client.getAllByType('services', {
      fetchLinks: ['post_category.name'],
    });

    // Map articles to Algolia records
    const serviceRecords = services.map(post => ({
      objectID: post.id, // Unique identifier in algolia
      title: post.data.heading, // Post title
      type: 'service', // Post type
      slug: `/services/${post.uid}`, // Post URL slug
      featured: true,
      author: 'Foot Factor',
      category:
          post.data.category && 'data' in post.data.category && (post.data.category.data as { name: string }).name,
      tags: 'service',
      image: post.data.meta_image, // Post featured image
      text: post.data?.description?.slice(0, 5000) ?? post.data?.meta_description ?? '', // Post content transformed to search text
    }));

    // Index records to Algolia
    await algoliaClient.saveObjects({indexName: 'global', objects: serviceRecords});

    // Get all articles from Prismic
    const pages = await client.getAllByType('page', {
      fetchLinks: ['post_category.name'],
    });

    // Map articles to Algolia records
    const pageRecords = pages.map(post => ({
      objectID: post.id, // Unique identifier in algolia
      title: post.data.meta_title, // Post title
      type: 'page', // Post type
      slug: `${post.uid}`, // Post URL slug
      featured: true,
      author: 'Foot Factor',
      category: 'all',
      tags: 'service',
      image: post.data.meta_image, // Post featured image
      text:  post.data?.meta_description ?? '', // Post content transformed to search text
    }));

    // Index records to Algolia
    await algoliaClient.saveObjects({indexName: 'global', objects: pageRecords});


    // Return success response if the process completes without any issue
    return new Response('Content successfully synchronized with Algolia search', {
      status: 200,
    });
  } catch (error) {
    // Log the error and return error response if any error occurs
    console.error(error);
    return new Response('An error occurred while synchronizing content', {
      status: 500,
    });
  }
}
