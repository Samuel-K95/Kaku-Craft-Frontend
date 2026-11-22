export type TikTokSpotlightClip = {
  id: string;
  title: string;
  href: string;
};

export const TIKTOK_PROFILE_URL =
  'https://www.tiktok.com/@kakucraft621?is_from_webapp=1&sender_device=pc';

/** Curated clips for the homepage spotlight (keep short — 3–4). */
export const TIKTOK_SPOTLIGHT_CLIPS: TikTokSpotlightClip[] = [
  {
    id: '7710574396401896724',
    title: 'Fresh from the hook',
    href: 'https://www.tiktok.com/@kakucraft621/video/7710574396401896724',
  },
  {
    id: '7707986730363768085',
    title: 'Stitch in motion',
    href: 'https://www.tiktok.com/@kakucraft621/video/7707986730363768085',
  },
  {
    id: '7706860640136187142',
    title: 'Wear the craft',
    href: 'https://www.tiktok.com/@kakucraft621/video/7706860640136187142',
  },
  {
    id: '7706173079214361876',
    title: 'Atelier close-up',
    href: 'https://www.tiktok.com/@kakucraft621/video/7706173079214361876',
  },
];

export function tiktokEmbedSrc(videoId: string): string {
  return `https://www.tiktok.com/embed/v2/${videoId}`;
}
