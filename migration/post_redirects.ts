import axios from 'axios';
import https from 'https';
import * as fs from 'node:fs';

const DOMAIN = 'https://footfactor.com/'

const fetchPosts = async () => {
  try {
    const response = await axios.get(`${DOMAIN}/wp-json/wp/v2/posts?per_page=100`, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

const posts = await fetchPosts();

posts.forEach(async (post: any) => {
  const { slug } = post;

  const redirect = `/${slug}/ /blog/${slug} \n`;

  // Append redirect to file
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  fs.appendFileSync('./migration/_redirects', redirect, (err: any) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });

  // create toml
  const toml = `[[redirects]]
  from = "/${slug}/"
  to = "/blog/${slug}/"
  status = 301
  force = true
 `;

  // Append redirect to file
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  fs.appendFileSync('./migration/_redirects.toml', toml, (err: any) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
});
