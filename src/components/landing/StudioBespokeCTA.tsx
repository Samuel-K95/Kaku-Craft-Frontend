// ============================================================================
// components/landing/StudioBespokeCTA.tsx
// ============================================================================
'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { ArrowRight, Scissors, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types';

interface StudioBespokeCTAProps {
  onBespokeClick: () => void;
  products?: Product[];
}

export const StudioBespokeCTA: React.FC<StudioBespokeCTAProps> = ({
  onBespokeClick,
  products = [],
}) => {
  const mosaic = useMemo(() => {
    const pool = [...products];
    // Prefer variety across categories for the mosaic
    const byCat = new Map<string, Product>();
    for (const p of pool) {
      if (!byCat.has(p.category)) byCat.set(p.category, p);
      if (byCat.size >= 4) break;
    }
    const diverse = [...byCat.values()];
    while (diverse.length < 4 && pool.length) {
      const next = pool.find((p) => !diverse.some((d) => d.id === p.id));
      if (!next) break;
      diverse.push(next);
    }
    return diverse.slice(0, 4);
  }, [products]);

  return (
    <section className="relative py-12 sm:py-16 md:py-24 px-4 md:px-12 bg-[#FDFBF7]/70 backdrop-blur-md overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[28px] sm:rounded-[40px] bg-[#2C302E] text-[#FDFBF7] p-6 sm:p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FDFBF7_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] text-[#D4A373] font-bold backdrop-blur-md">
                <Scissors className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Custom Orders</span>
              </div>

              <h2 className="font-serif text-[1.75rem] sm:text-5xl md:text-6xl font-normal leading-[1.1] tracking-tight">
                Looking for something custom?{' '}
                <span className="italic text-[#D4A373]">We make it exactly how you want.</span>
              </h2>

              <p className="text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed font-sans font-medium">
                Choose your colors, give us your size, or design a special doll. We will make it by hand just for you in Addis Ababa — the same craft you see in our collection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-white/80 font-mono">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
                  <span>Custom Colorway Matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
                  <span>Your Size: M · L · XL · XXL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
                  <span>Handcraft Timeline by Piece</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
                  <span>Made in Addis Ababa</span>
                </div>
              </div>

              <div className="pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={onBespokeClick}
                  className="w-full sm:w-auto justify-center px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#D4A373] text-[#2C302E] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#FDFBF7] transition-all duration-300 shadow-xl flex items-center space-x-3 group"
                >
                  <span>Inquire Bespoke Piece</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative order-first lg:order-none">
              {mosaic.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-[320px] sm:max-w-[380px] mx-auto">
                  {mosaic.map((product, i) => (
                    <div
                      key={product.id}
                      className={`relative overflow-hidden border border-white/15 shadow-xl ${
                        i === 0
                          ? 'rounded-[28px_12px_28px_12px] aspect-[3/4]'
                          : i === 1
                            ? 'rounded-[12px_28px_12px_28px] aspect-[3/3.6] mt-4 sm:mt-6'
                            : i === 2
                              ? 'rounded-[12px_28px_28px_12px] aspect-[3/3.6] -mt-2 sm:-mt-4'
                              : 'rounded-[28px_12px_12px_28px] aspect-[3/4]'
                      }`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 45vw, 180px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C302E]/70 via-transparent to-transparent" />
                      <p className="absolute bottom-2.5 left-2.5 right-2.5 text-[10px] font-serif text-white truncate">
                        {product.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative aspect-square w-full max-w-[360px] mx-auto rounded-3xl overflow-hidden border-2 border-white/20 bg-[#1a1c1b] flex items-center justify-center">
                  <p className="text-sm text-white/50 font-medium px-6 text-center">
                    Live collection pieces will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
