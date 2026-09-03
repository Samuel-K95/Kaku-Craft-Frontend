// ============================================================================
// components/landing/StudioBespokeCTA.tsx
// ============================================================================
'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Scissors, CheckCircle2 } from 'lucide-react';

interface StudioBespokeCTAProps {
  onBespokeClick: () => void;
}

export const StudioBespokeCTA: React.FC<StudioBespokeCTAProps> = ({
  onBespokeClick,
}) => {
  return (
    <section className="relative py-24 px-4 md:px-12 bg-[#FDFBF7] overflow-hidden">
      {/* Background Decorative Graphic Yarn Ring */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-[#D4A373]/20 pointer-events-none -mr-48" />

      <div className="max-w-7xl mx-auto">
        <div className="rounded-[40px] bg-[#2C302E] text-[#FDFBF7] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          {/* Subtle Organic Background Texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FDFBF7_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Bespoke Narrative & Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] text-[#D4A373] font-bold backdrop-blur-sm">
                <Scissors className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Custom Needlework Commissions</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.08] tracking-tight">
                Have a silhouette in mind? <br />
                <span className="italic text-[#D4A373]">We sculpt to your exact frame.</span>
              </h2>

              <p className="text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed font-sans">
                Choose your yarn palette, specify chest and sleeve proportions, or design a custom heirloom amigurumi doll. Each custom commission is assigned directly to a master artisan in Addis Ababa.
              </p>

              {/* Quality Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-white/80 font-mono">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
                  <span>Custom Colorway Matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
                  <span>Personalized Monogram Label</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
                  <span>3-Week Handcraft Timeline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
                  <span>Worldwide Express Dispatch</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={onBespokeClick}
                  className="px-8 py-4 rounded-full bg-[#D4A373] text-[#2C302E] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#FDFBF7] transition-all duration-300 shadow-xl flex items-center space-x-3 group"
                >
                  <span>Inquire Bespoke Piece</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: Editorial Visual Swatch */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square w-full max-w-[360px] mx-auto rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop"
                  alt="Crochet wearable fitted silhouette"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C302E]/80 via-transparent to-transparent" />

                {/* Floating Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#FDFBF7]/95 text-[#2C302E] p-3 rounded-2xl backdrop-blur-md flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider">Highland Wool Swatches</p>
                    <p className="text-[9px] text-[#2C302E]/60 font-mono">Available in 18 Organic Dyes</p>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-[#D4A373] flex items-center justify-center text-white text-[10px] font-bold">
                    ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};