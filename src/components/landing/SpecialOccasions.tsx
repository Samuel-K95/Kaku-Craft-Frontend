// ============================================================================
// components/landing/SpecialOccasions.tsx
// ============================================================================
'use client';

import React from 'react';
import Image from 'next/image';

interface SpecialOccasionProps {
  // These would typically come from a CMS
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export const SpecialOccasions: React.FC<SpecialOccasionProps> = ({
  title = "Happy Holidays from Kaku Craft",
  subtitle = "Wishing you a warm and joyful season filled with love, laughter, and cozy handmade moments.",
  imageUrl = "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1200&auto=format&fit=crop"
}) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto py-16 px-4 md:px-12">
      <div className="relative rounded-[32px] overflow-hidden bg-[#FDFBF7] border border-[#EFEBE4] shadow-md group">
        {/* Background Image */}
        <div className="relative h-[300px] md:h-[400px] w-full">
          <Image 
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 md:p-12 z-10 pointer-events-none">
          <span className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-[#D4A373] bg-[#2C302E]/60 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            Special Occasion
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-3 drop-shadow-md">
            {title}
          </h2>
          <p className="font-sans text-sm md:text-base text-white/90 max-w-xl font-medium drop-shadow-sm">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};
