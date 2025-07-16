import { type MetadataRoute } from 'next';
import { createClient } from '@/prismicio';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient();

  const posts = await client
    .getByType('posts', {
      pageSize: 100,
      page: 0,
      fetchLinks: ['author.name', 'author.profile_image', 'post_category.name', 'post_category.uid'],
      orderings: [
        {
          field: 'my.posts.published_date',
          direction: 'desc',
        },
      ],
    })
    .then(response => {
      return response.results;
    })
    .catch(() => []);


  const blogPosts = posts.map(post => {
    return {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/blog/${post.uid}`,
      lastModified: post.data.publishing_date?.toString() ?? new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  const conditions = await client
      .getByType('condition', {
        pageSize: 100,
        page: 0,
        fetchLinks: ['author.name', 'author.profile_image', 'condition_category.name', 'condition_category.uid'],
        orderings: [
          {
            field: 'my.condition.last_publication_date',
            direction: 'desc',
          },
        ],
      })
      .then(response => {
        return response.results;
      })
      .catch(() => []);


  const conditionsPosts = conditions.map(post => {
    return {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/conditions/${(post.data.category as {uid:string}).uid}/${post.uid}`,
      lastModified: post.last_publication_date?.toString() ?? new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  const caseStudies = await client
      .getByType('case_studies', {
        pageSize: 100,
        page: 0,
        fetchLinks: ['author.name', 'author.profile_image'],
        orderings: [
          {
            field: 'my.case_studies.last_publication_date',
            direction: 'desc',
          },
        ],
      })
      .then(response => {
        return response.results;
      })
      .catch(() => []);


  const caseStudiesPosts = caseStudies.map(post => {
    return {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/case-studies/${post.uid}`,
      lastModified: post.last_publication_date?.toString() ?? new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });


  const guides = await client
      .getByType('guide', {
        pageSize: 100,
        page: 0,
        fetchLinks: ['author.name', 'author.profile_image'],
        orderings: [
          {
            field: 'my.case_studies.last_publication_date',
            direction: 'desc',
          },
        ],
      })
      .then(response => {
        return response.results;
      })
      .catch(() => []);


  const guidePosts = guides.map(post => {
    return {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/guides/${post.uid}`,
      lastModified: post.last_publication_date?.toString() ?? new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  const main = [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about-us`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/faqs`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/guides`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/new-patient`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/case-studies--testimonials`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ];

  return [...main, ...blogPosts, ...conditionsPosts, ...caseStudiesPosts, ...guidePosts] as MetadataRoute.Sitemap;
}
