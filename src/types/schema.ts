import {
  type WithContext,
  type MedicalWebPage,
  type ContactPage,
  type Blog,
  type BlogPosting,
} from 'schema-dts';
import {type PostsDocument} from '@/prismic-types';

const JSONLD: WithContext<MedicalWebPage> = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://footfactor.com',
  },
  name: 'Foot Factor – Precision Podiatry & Same-Day Orthotics in London',
  url: 'https://footfactor.com',
  description:
      'Foot Factor offers expert-led sports podiatry and custom orthotics crafted on-site in just 90 minutes. From injury recovery to performance enhancement, we support active lifestyles with cutting-edge analysis, diagnostics, and bespoke foot care.',
  about: {
    '@type': 'MedicalCondition',
    name: 'Foot, Ankle, and Lower Limb Biomechanics',
  },
  mainEntity: {
    '@type': 'MedicalSpecialty',
    name: 'Podiatric Sports Medicine',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Foot Factor',
    logo: {
      '@type': 'ImageObject',
      url: 'https://footfactor.com/share-img.png',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44 20 7946 0123',
      contactType: 'Patient Inquiries',
      areaServed: 'GB',
      availableLanguage: ['English'],
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://footfactor.com/search?q={search_term_string}',
  },
};

export const CONTACTJSONLD: WithContext<ContactPage> = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://footfactor.com/contact',
  },
  name: 'Contact Foot Factor – Same-Day Custom Orthotics & Expert Podiatry',
  url: 'https://footfactor.com/contact',
  description:
      'Get in touch with Foot Factor to book expert podiatry consultations or same-day orthotic fittings. Located in Central London and led by specialists in biomechanics and foot health.',
  about: {
    '@type': 'MedicalCondition',
    name: 'Musculoskeletal & Biomechanical Foot Health',
  },
  mainEntity: {
    '@type': 'Organization',
    name: 'Foot Factor',
    url: 'https://footfactor.com/about-us',
    image: 'https://footfactor.com/share-img.png',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Foot Factor',
    logo: {
      '@type': 'ImageObject',
      url: 'https://footfactor.com/share-img.png',
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://footfactor.com/search?q={search_term_string}',
  },
};

export const BLOGJSONLD = (featurePosts: PostsDocument[]): WithContext<Blog> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://footfactor.com/resources',
    },
    name: 'Foot Factor Resources – Insights on Performance, Recovery & Foot Health',
    url: 'https://footfactor.com/resources',
    description:
        'Expert insights from Foot Factor on foot biomechanics, injury prevention, sports podiatry, and the science behind custom orthotics.',
    publisher: {
      '@type': 'Organization',
      name: 'Foot Factor',
      logo: {
        '@type': 'ImageObject',
        url: 'https://footfactor.com/share-img.png',
      },
    },
    blogPost: featurePosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.data.title ?? '',
      url: `https://footfactor.com/resources/${post.uid}`,
      datePublished: post.data.publishing_date ?? '',
      dateModified: post.data.publishing_date ?? '',
      author: {
        '@type': 'Organization',
        name: 'Foot Factor',
      },
      image: post.data.feature_image?.url ? [post.data.feature_image.url] : [],
      description: post.data.excerpt || '',
    })) as BlogPosting[],
  };
};

export default JSONLD;
