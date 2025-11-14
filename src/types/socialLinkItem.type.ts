import type { LinkPrismicType } from '@/types/link.prismic.type';

export type SocialName =
    | 'facebook'
    | 'instagram'
    | 'twitter'
    | 'github'
    | 'youtube'
    | 'tiktok'
    | 'linkedin'
    | 'discord';


export type SocialLinkItemType = {
  type?: SocialName | undefined | null;
  name?: string | undefined | null;
  url?: LinkPrismicType | undefined | null;
};
