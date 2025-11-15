'use client';
import React, {useEffect, useState} from 'react';
import {type AllDocumentTypes} from '@/prismic-types';
import {createClient} from '@/prismicio';
import {asText,  type ImageField, type KeyTextField, type RichTextField, filter} from '@prismicio/client';
import Slider from '@/components/features/slider/slider';
import {SliderCard} from '@/components/features/slider/slider-card';

interface SliderDynamicListProps {
    contentType: 'orthotics' | 'guide' | 'condition';
    baseUrl?: string;
    tags?: string[];
    category?: string;
    aspectRatio?: string;
    size?: 'large' | 'default';
}

const getTypeByCategoryTags = async (
  contentType: "orthotics" | "guide" | "condition",
  category?: string,
  tags?: string[]
): Promise<{ results: AllDocumentTypes[] }> => {
  const client = createClient();

  if (!contentType) {
    throw new Error("Content type is required");
  }

  const filters: any[] = [];

  // Optional: filter by category if you have a category field
  if (category) {
    filters.push(
      filter.at(`my.${contentType}.category`, category)
    );
  }

  // Optional: filter by tags (relationship IDs)
  if (tags && tags.length > 0) {
    filters.push(
      filter.any(`my.${contentType}.tags.tag`, tags)
      // or: `my.${contentType}.post_tags.tag` if post_tags is a Group with a "tag" link field
    );
  }

  return await client.getByType(contentType, {
    filters: filters.length ? filters : undefined,
    pageSize: 20,
  });
};

type ImageData = {
    data: {
        image?: ImageField;
        thumb?: ImageField;
        feature_image?: ImageField;
    }
}

type HeadingData = {
    data: {
        heading?: KeyTextField | RichTextField;
        title?: KeyTextField | RichTextField;
        name?: KeyTextField | RichTextField;
    }
}

const getImageField = (item: ImageData): ImageField | null => {
    return item?.data?.thumb ?? item?.data?.feature_image ?? item.data?.image ?? null;
};

const getHeading = (item: HeadingData): string => {
    const field = item.data.heading ?? item.data.title ?? item.data.name;
    return typeof field === 'string' ? field : asText(field) ?? '';
};


export const SliderDynamicList = ({contentType,category, tags, baseUrl, aspectRatio = 'portrait', size}: SliderDynamicListProps) => {

    const [items, setItems] = useState<AllDocumentTypes[] >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getTypeByCategoryTags(contentType, category, tags)
                setItems(data.results);
            } catch (err) {
                setError('Failed to fetch Items');
                console.error('Error fetching Items:', err);
            } finally {
                setLoading(false);
            }
        };

        void fetchItems();
    }, [contentType, category, tags]);


    if (loading) {
        return (
            <div>
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    if (items.length === 0) {
        return null
    }


    const controlsData = items.map((item) => {
        const { heading, title, name } = item.data as {
            title?: string;
            name?: string;
            heading?: string;
        };

        const resolvedTitle =
            heading ??
            title ??
            name ??
            ""; // fallback so TypeScript is happy

        return { title: resolvedTitle };
    });


    return (
        <Slider data={controlsData} size={size}>
            {items.map((item, idx) => (
                <SliderCard
                    index={idx}
                    key={item.id ?? item.uid ?? idx}
                    keyPrefix={contentType}
                    imageField={getImageField(item as ImageData) ?? null}
                    title={getHeading(item as HeadingData)}
                    href={`${baseUrl}/${item.uid}`}
                    contentType={'' + contentType.toString().toUpperCase()}
                    size={size}
                    aspectRatio={aspectRatio ?? 'portrait'}
                />
            ))}
        </Slider>
  )
}

export default SliderDynamicList;
