import {
  type WithContext,
  type MedicalWebPage,
  type Organization,
  type ContactPage,
  type FAQPage,
  type Blog,
  type BlogPosting,
  type MedicalProcedure,
  type WebPage
} from 'schema-dts';
import {type PostsDocument} from '@/prismic-types';

export const JSONLD: WithContext<MedicalWebPage> = {
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

export const ABOUTUSJSONLD: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Foot Factor',
  url: 'https://footfactor.com/about-us',
  logo: 'https://footfactor.com/share-img.png',
  description:
      'Foot Factor is a leading podiatry and orthotics clinic in London, providing expert sports podiatry assessments and same-day custom orthotics to help clients achieve peak performance and recovery.',
  sameAs: [
    'https://www.instagram.com/footfactor',
    'https://www.facebook.com/footfactor',
    // Add real social profiles if available
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    telephone: '+44 20 7946 0123',
    areaServed: 'GB',
    availableLanguage: ['English'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5th Floor, Edinburgh House, 40 Great Portland Street',
    addressLocality: 'London',
    postalCode: 'W1W 7LZ',
    addressCountry: 'GB',
  },
};

export const TESTIMONIALJSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  reviewBody:
      'Incredible service. I got my orthotics fitted the same day and they completely solved my knee pain.',
  reviewRating: {
    '@type': 'Rating',
    ratingValue: '5',
    bestRating: '5',
  },
  author: {
    '@type': 'Person',
    name: 'Sarah J.',
  },
  itemReviewed: {
    '@type': 'MedicalClinic',
    name: 'Foot Factor',
  },
};

export const ORTHOTICSJSONLD: WithContext<MedicalProcedure> = {
  '@context': 'https://schema.org',
  '@type': 'MedicalProcedure',
  name: 'Custom Orthotics Fitting',
  url: 'https://footfactor.com/services/orthotics',
  description:
      'Foot Factor creates same-day custom orthotics using advanced gait analysis, 3D scanning, and thermo-moulding to relieve pain, improve function, and support active lifestyles.',
  bodyLocation: 'Foot, Ankle, Lower Limb',
  procedureType: 'https://schema.org/NoninvasiveProcedure',
  relevantSpecialty: {
    '@type': 'MedicalSpecialty',
    name: 'Podiatric Sports Medicine',
  },
  recognizingAuthority: {
    '@type': 'MedicalOrganization',
    name: 'The College of Podiatry',
  },
};

export const PODIATRYJSONLD: WithContext<MedicalProcedure> = {
  '@context': 'https://schema.org',
  '@type': 'MedicalProcedure',
  name: 'Sports Podiatry Assessment',
  url: 'https://footfactor.com/services/podiatry',
  description:
      'Advanced sports podiatry consultation at Foot Factor includes diagnostic gait and posture analysis, biomechanical assessment, and personalized treatment planning.',
  bodyLocation: 'Foot, Ankle, Knee, Hip',
  procedureType: 'https://schema.org/NoninvasiveProcedure',
  relevantSpecialty: {
    '@type': 'MedicalSpecialty',
    name: 'Sports Medicine',
  },
};


export const FOOTCAREJSONLD: WithContext<MedicalProcedure> = {
  '@context': 'https://schema.org',
  '@type': 'MedicalProcedure',
  name: 'Routine Foot Care Treatment',
  url: 'https://footfactor.com/services/foot-care',
  description:
      'Routine podiatry services at Foot Factor include diabetic foot checks, treatment of corns and calluses, nail care, and skin health to support overall foot wellbeing.',
  bodyLocation: 'Foot',
  procedureType: 'NoninvasiveProcedure',
  relevantSpecialty: {
    '@type': 'MedicalSpecialty',
    name: 'Podiatric Medicine',
  },
};


export const NEWPATIENTJSONLD: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'New Patient Guide – Foot Factor',
  url: 'https://footfactor.com/resources/new-patient-info',
  description:
      'Everything you need to know before your first visit to Foot Factor. Learn what to expect, what to bring, how to book, and our approach to expert podiatry and custom orthotics.',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://footfactor.com/resources/new-patient-info',
  },
  about: {
    '@type': 'MedicalClinic',
    name: 'Foot Factor',
  },
};


//TODO: UPDATE WITH DYNAMIC DATA
export const FAQJSONLD: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does it take to get custom orthotics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most clients leave with their orthotics the same day. The entire process usually takes around 90 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I bring to my appointment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Please bring 2–3 pairs of shoes you use often and wear comfortable clothes. For sports orthotics, bring relevant gear like running or ski shoes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a referral to book?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No referral is necessary. You can book directly through our website or by phone.',
      },
    },
  ],
};

//TODO: ADD DYNAMIC CONDITIONS

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
