'use client';
import React, {useEffect, useState} from 'react';
import {type AllDocumentTypes} from '@/prismic-types';
import {createClient} from '@/prismicio';
import {asText, filter, type ImageField, KeyTextField, RichTextField} from '@prismicio/client';
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

const getTypeByCategoryTags = async (contentType: 'orthotics' | 'guide' | 'condition' ,category?: string, tags?: string[]): Promise<{
    results: AllDocumentTypes[];
}> => {
    const client = createClient();

    console.log('category', category)

    if (!contentType) {
        throw new Error('Content type is required');
    }

    return await client.getByType(contentType, {
        pageSize: 20,
        filters: [
            //filter.at('my.faq.show_on_faqs', true),
            //filter.at('my.faq.category', category)
        ]
    });
}

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
    }, []);


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


    const controlsData = items.map((item: any) => ({
        title: item.data.heading ?? item.data.title ?? item.data.name,
    }));


    console.log('controlsData', items)


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
