import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';
import config from '../slicemachine.config.json';
import {type ClientConfig} from '@prismicio/client';
/**
 * The project's Prismic repository name.
 */
export const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT ?? config.repositoryName;

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
// TODO: Update the routes array to match your project's route structure.
const routes: prismic.ClientConfig['routes'] = [
  {type: 'settings', path: '/'},
  {type: 'navigation_bar', path: '/'},
  { type: 'home', path: '/', uid: 'home' },
  { type: 'page', path: '/:uid'},
  { type: 'conditions',  path: '/conditions'},
  { type: 'page', uid: 'new-patient', path: '/resources/new-patient'},
  { type: 'page', uid: 'faqs', path: '/resources/faqs'},
  { type: 'page', uid: 'case-studies--testimonials', path: '/resources/case-studies--testimonials'},
  { type: 'case_studies', path: '/resources/case-studies/:uid'},
  { type: 'condition', path: '/conditions/:uid'},
  { type: 'services', path: '/services/:uid' },
  { type: 'orthotics', path: '/services/orthotics/:uid'},
  { type: 'posts', path: '/resources/blog/:uid' },
  { type: 'guide', path: '/resources/guides/:uid'},
  { type: 'legal', path: '/legal/:uid' }



];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: ClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
        process.env.NODE_ENV === 'production'
            ? {next: {tags: ['prismic']}, cache: 'force-cache'}
            : {next: {revalidate: 5}},
    ...config,
  });

  prismicNext.enableAutoPreviews({client});

  return client;
};
