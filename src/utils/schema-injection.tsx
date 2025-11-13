import {
  JSONLD,
  CONTACTJSONLD,
  ABOUTUSJSONLD,
  TESTIMONIALJSONLD,
  FAQJSONLD,
  ORTHOTICSJSONLD,
  PODIATRYJSONLD,
  FOOTCAREJSONLD,
  NEWPATIENTJSONLD,
} from '@/types/schema';

const schemaMap: Record<string, object> = {
  'contact-us': CONTACTJSONLD,
  'about-us': ABOUTUSJSONLD,
  'faqs': FAQJSONLD,
  'orthotics-insoles': ORTHOTICSJSONLD,
  'podiatry': PODIATRYJSONLD,
  'foot-care': FOOTCAREJSONLD,
  'case-studies--testimonials' : TESTIMONIALJSONLD,
  'new-patient' : NEWPATIENTJSONLD,
  'default': JSONLD, // Fallback schema
  // Add more as needed
};

type Props = {
  uid: string;
};

export default function SchemaInjector({uid}: Props) {
  const schema = schemaMap[uid] ?? JSONLD;

  return (
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
      />
  );
}
