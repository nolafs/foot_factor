process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import "dotenv/config";
import axios from "axios";
import * as prismic from "@prismicio/client";
import https from "https";
import {htmlAsRichText} from "@prismicio/migrate";
import {repositoryName} from "./../slicemachine.config.json";

// Prismic setup
const writeClient = prismic.createWriteClient(
    repositoryName,
    {
      writeToken: process.env.PRISMIC_WRITE_TOKEN!
    },
);

const migration = prismic.createMigration();

// fetch all documents from word-press API

const fetchPosts = async () => {
  try {
    const response = await axios.get("https://footfactor.com/wp-json/wp/v2/posts?_embed", {
      httpsAgent: new https.Agent({rejectUnauthorized: false})
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

const fetchPostsCategories = async () => {
  try {
    const response = await axios.get("https://footfactor.com/wp-json/wp/v2/categories", {
      httpsAgent: new https.Agent({rejectUnauthorized: false})
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

const formatDate = (date?: string): string | undefined | any => {
  return new Date(date || Date.now()).toISOString().split('T')[0];
};

console.log("Fetching posts from WordPress API...");

const posts = await fetchPosts();
const categories = await fetchPostsCategories();
const categoriesList: any[] = [];

categories.forEach(async (category: any) => {
  const {id, name, slug} = category;

  const doc = migration.createDocument({
    type: "post_category",
    lang: "en-gb",
    uid: slug,
    data: {
      name: name,
    },
  }, name);

  categoriesList.push({
    uid: slug,
    doc
  });
});



posts.forEach(async (post: any) => {
  const {id, title, content, excerpt, date, slug, _embedded} = post;


  const richText = htmlAsRichText(content.rendered, {
    serializer: {
      // @ts-ignore
      img: ({node}) => {

        const src = node.properties.src;

        if(!src || typeof src !== "string") {
          return null;
        }

        const filename = src.split("/").pop();
        const alt: string = node.properties.alt as string;

        if(filename) {
          return {
            type: "image",
            id: migration.createAsset(src, filename, {alt}),
          };
        }
      },
    },
  }).result;

  const excerptRichText = htmlAsRichText(excerpt.rendered).result;


  const featuredMedia: any = _embedded['wp:featuredmedia'][0];
  const categorySlug = _embedded?.['wp:term']?.[0]?.[0]?.slug || "uncategorized";

  if(!excerpt.rendered){
    excerpt.rendered = "No excerpt provided";
  }

  const data = {
    title: title.rendered,
    content: richText,
    publishing_date: formatDate(date) || undefined,
    category: categoriesList.find((category) => category.uid === categorySlug)?.doc || categoriesList.find((category) => category.uid === "uncategorized")?.doc,
    excerpt: excerptRichText,
    feature_image: migration.createAsset(
        featuredMedia.source_url,
        featuredMedia.source_url.split("/").pop(),
        {
          alt: featuredMedia.title.rendered,
        }
    ),
  }

  console.log("CREATE DATA", data)

  const doc = migration.createDocument({
    type: "posts",
    lang: "en-gb",
    uid: slug,
    tags: ["wordpress"],
    // @ts-ignore
    data: data,
  }, title.rendered);

});

console.log("Migrating write documents...");


await writeClient.migrate(migration, {
  reporter: (event) => console.log(event),
});
