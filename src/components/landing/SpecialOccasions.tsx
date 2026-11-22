'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ADMIN_CMS } from '@/data/admin/seed';
import { api } from '@/lib/api';
import { ApiSiteContent } from '@/types/cms';

interface SpecialOccasionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  active?: boolean;
}

export const SpecialOccasions: React.FC<SpecialOccasionProps> = (props) => {
  const { data: contents } = useQuery({
    queryKey: ['cms-content'],
    queryFn: () => api.get<ApiSiteContent[]>('/cms/content/', { requiresAuth: false }),
    staleTime: 60 * 1000,
  });

  const banner =
    contents?.find((c) => c.key === 'special-occasion-banner') ||
    contents?.find((c) => c.section === 'special_occasion');

  const data = (banner?.data || {}) as {
    active?: boolean;
    imageUrl?: string;
  };

  const title = props.title ?? banner?.title ?? ADMIN_CMS.specialOccasion.title;
  const subtitle = props.subtitle ?? banner?.body ?? ADMIN_CMS.specialOccasion.subtitle;
  const imageUrl =
    props.imageUrl ??
    data.imageUrl ??
    banner?.image ??
    ADMIN_CMS.specialOccasion.imageUrl;
  const active =
    props.active ??
    (banner ? Boolean(banner.is_published && (data.active ?? true)) : ADMIN_CMS.specialOccasion.active);

  if (!active) return null;

  return (
    <section className="relative w-full max-w-7xl mx-auto py-16 px-4 md:px-12">
      <div className="relative rounded-[32px] overflow-hidden bg-[#FDFBF7] border border-[#EFEBE4] shadow-md group">
        <div className="relative h-[300px] md:h-[400px] w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 md:p-12 z-10 pointer-events-none">
          <span className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-[#D4A373] bg-[#2C302E]/60 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            Special Occasion
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-3 drop-shadow-md">{title}</h2>
          <p className="font-sans text-sm md:text-base text-white/90 max-w-xl font-medium drop-shadow-sm">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};
