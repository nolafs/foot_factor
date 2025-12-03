process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import "dotenv/config";
import axios from "axios";
import * as prismic from "@prismicio/client";
import https from "https";
import {htmlAsRichText} from "@prismicio/migrate";

import {repositoryName} from "./../slicemachine.config.json";

const DOMAIN = 'https://footfactor.com/'

// Prismic setup
const writeClient = prismic.createWriteClient(
    repositoryName,
    {
      writeToken: process.env.PRISMIC_WRITE_TOKEN!
    },
);


const client = prismic.createClient(repositoryName);

const migration = prismic.createMigration();

// fetch all documents from word-press API

const fetchPosts = async () => {
  try {
    const response = await axios.get(`${DOMAIN}/wp-json/wp/v2/posts?page=1&per_page=100&_embed`, {
      httpsAgent: new https.Agent({rejectUnauthorized: false})
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};




const formatDate = (date?: string): string | undefined  => {
  return new Date(date ?? Date.now()).toISOString().split('T')[0];
};

console.log("Fetching posts from WordPress API...");

const posts = await fetchPosts();

posts.forEach(async (post: any) => {
  const {title, content, excerpt, date, slug, _embedded} = post;
  const richText = htmlAsRichText(content.rendered, {
    serializer: {
       
      // @ts-expect-error
      img: ({node}) => {

        const src = node.properties.src;

        if(!src || typeof src !== "string") {
          return null;
        }

        const filename = src.split("/").pop();
        const alt: string = node.properties.alt as string;

        if (filename) {
          // Ensure the asset is an image
          if (src.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            return {
              type: "image",
              id: migration.createAsset(src, filename, {alt}),
            };
          } else {
            console.error(`The asset with the ID '${filename}' is not an image.`);
            return null;
          }
        }
      },
       
      // @ts-expect-error
      a: ({node}) => {
        const href = node.properties.href;

        if(!href || typeof href !== "string") {
          return null;
        }

        // Matches URLs like `/blog/hello-world`
        if (href.startsWith("/blog/")) {
          // e.g. `hello-world`
          const uid = href.split("/").pop();

          if(!uid) {
            return null;
          }

          return {
            type: "hyperlink",
            // Creates a content relationship to
            // the blog post with a matching `uid`
            data: () => migration.getByUID("posts", uid),
          };
        }

        // Serializes other links as external links
        return "hyperlink";
      },
       
      // @ts-expect-error
      iframe: ({node}) => {
        const src = node.properties.src;
        if (!src || typeof src !== "string") {
          return null;
        }

        console.log("EMBED", src)

        // Check if the embed URL has the required metadata
        if (src.includes("www.youtube.com")) {
          return {
            type: "embed",
            oembed: {
              embed_url: `https://youtu.be/${src.split("/").pop()}`,
            },
          };
        }

        if (src.includes("youtu.be")) {
          return {
            type: "embed",
            oembed: {
              embed_url: `https://youtu.be/${src.split("/").pop()}`,
            },
          };
        }


        console.error(`We couldn't find data for the embed url ${src}, error: 'no meta url'`);
        return null;
      }
    },
  }).result;

  const excerptRichText = htmlAsRichText(excerpt.rendered).result;


  const featuredMedia = _embedded?.['wp:featuredmedia']?.[0] ?? null;
  const categorySlug = _embedded?.['wp:term']?.[0]?.[0]?.slug || "uncategorized";
  const tagsSlug = _embedded?.['wp:term']?.[1]?.map((tag: any) => tag.slug) || [];



  if(!excerpt.rendered){
    excerpt.rendered = "No excerpt provided";
  }



  console.log("TAGS SLUGS", tagsSlug)

  const tagList = tagsSlug.map((tagSlug: string) => {
    return {tag: async () => {
      const existingBarDocument = await client.getByUID("post_tags", tagSlug);
      return existingBarDocument;
      }};
  });

  console.log("TAGS LIST", tagList)


  const data = {
    title: title.rendered,
    content: richText,
    publishing_date: formatDate(date) ?? undefined,
    category: async () => {
      const existingBarDocument = await client.getByUID("post_category", categorySlug);
      return existingBarDocument;
    },
    tags: tagList,
    author: async () => {
      const existingBarDocument = await client.getByUID("author", "foot-factor");
      return existingBarDocument;
    },
    excerpt: excerptRichText,
    feature_image: featuredMedia ? migration.createAsset(
        featuredMedia.source_url,
        featuredMedia.source_url.split("/").pop(),
        {
          alt: featuredMedia.title.rendered,
        }
    ) : undefined,
  }


  const doc = migration.createDocument({
    type: "posts",
    lang: "en-gb",
    uid: slug,
    tags: tagsSlug,
    alternate_language_id: "en-gb",
     
    // @ts-expect-error
    data: data,
  }, title.rendered);


});

console.log("Migrating write documents...");

console.log("Migration", migration);


await writeClient.migrate(migration, {
  reporter: (event) => console.log(event),
});
