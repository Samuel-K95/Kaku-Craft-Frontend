// ============================================================================
// components/views/AboutView.tsx
// ============================================================================
'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Scissors, Compass, HeartHandshake } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <main className="relative min-h-screen py-16 px-4 md:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* --- EDITORIAL HEADER --- */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 backdrop-blur-sm px-5 py-2 rounded-full border border-[#EFEBE4]">
            <span>Who We Are</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2C302E] leading-none tracking-tight">
            The Value of <br />
            <span className="italic font-normal text-[#B85D43]">Handmade Work.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#2C302E]/70 leading-relaxed font-sans max-w-lg mx-auto font-medium">
            Taking the time to craft beautiful, lasting clothing and accessories in the Ethiopian highlands.
          </p>
        </div>

        {/* --- SMALLER EDITORIAL HERO SHOWCASE --- */}
        <div className="relative aspect-[16/9] max-w-4xl mx-auto w-full rounded-[40px] overflow-hidden border-2 border-[#EFEBE4] shadow-md">
          <Image 
            src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop"
            alt="Hands crocheting with wooden hooks and organic wool"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C302E]/70 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs font-mono">
            <span className="bg-[#2C302E]/80 backdrop-blur-md px-4 py-2 rounded-full uppercase tracking-widest text-[10px] font-bold">
              Addis Ababa Studio
            </span>
            <span className="hidden sm:inline-block text-[#D4A373] uppercase tracking-widest font-bold text-[10px] bg-[#2C302E]/80 backdrop-blur-md px-4 py-2 rounded-full">
              100% Handmade Process
            </span>
          </div>
        </div>

        {/* --- NARRATIVE TWO-COLUMN EDITORIAL GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4A373] font-mono">
              Our Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C302E] leading-tight">
              &ldquo;To knit is to make clothing; to crochet is to craft art stitch by stitch.&rdquo;
            </h2>
            <div className="w-16 h-0.5 bg-[#D4A373]" />
          </div>

          <div className="lg:col-span-7 space-y-6 text-[#2C302E]/80 font-sans text-sm sm:text-base leading-relaxed font-medium">
            <p>
              Based in Addis Ababa, <strong>Kaku Craft</strong> is a handmade clothing studio. We focus on the peaceful art of crochet to create beautiful, modern clothing and items.
            </p>
            <p>
              Unlike factory machines, real crochet can only be done by human hands. Every single loop is made by an artisan. When you wear a Kaku Craft item, you are wearing something that took hours of focus and care to make.
            </p>
            <p>
              Our process is also completely zero-waste. From our Ethiopian highland wool to our natural plant dyes, we make sure to use everything and throw away nothing.
            </p>
          </div>
        </div>

        {/* --- THREE CORE PILLARS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="p-8 rounded-[32px] bg-[#EFEBE4]/75 border border-[#EFEBE4] space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-[#B85D43]/15 flex items-center justify-center text-[#B85D43]">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#2C302E] font-bold">One Artisan Per Item</h3>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-sans font-medium">
              One skilled crafter shapes your garment from the first loop to the final knot, ensuring consistent tension and quality.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-[#EFEBE4]/75 border border-[#EFEBE4] space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-[#52796F]/15 flex items-center justify-center text-[#52796F]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#2C302E] font-bold">Zero-Waste Making</h3>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-sans font-medium">
              Our loop method uses exactly the amount of yarn needed. We produce zero fabric scraps that would end up in a landfill.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-[#EFEBE4]/75 border border-[#EFEBE4] space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-[#D4A373]/20 flex items-center justify-center text-[#D4A373]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#2C302E] font-bold">Lifetime Support</h3>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-sans font-medium">
              Every item comes with matching yarn for repairs. We are here to help you fix any damage your item might take over the years.
            </p>
          </div>
        </div>

        {/* --- EVENTS, GALLERY & EXHIBITIONS SECTION --- */}
        <div className="pt-16 pb-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C302E]">Events & Exhibitions</h2>
            <p className="text-sm font-medium text-[#2C302E]/70 max-w-lg mx-auto">
              Join us in person to see our latest collections and meet the crafters behind Kaku Craft.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {/* Event 1 — image left, text right */}
            <div className="group grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[32px] border border-[#EFEBE4] bg-[#FDFBF7] hover:shadow-lg transition-all">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[280px] w-full">
                <Image 
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"
                  alt="Addis Ababa Fashion Week"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#B85D43]">
                  Upcoming
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-10 space-y-3">
                <h3 className="font-serif text-2xl md:text-3xl text-[#2C302E] font-bold">Addis Ababa Fashion Week</h3>
                <p className="text-xs font-mono text-[#2C302E]/60 uppercase tracking-widest font-bold">
                  Nov 12 - Nov 15, 2026 • Skylight Hotel
                </p>
                <p className="text-sm font-medium text-[#2C302E]/80 leading-relaxed">
                  Catch our runway debut featuring our winter collection of oversized mohair cardigans and heavy-knit blankets.
                </p>
              </div>
            </div>

            {/* Event 2 — text left, image right */}
            <div className="group grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[32px] border border-[#EFEBE4] bg-[#FDFBF7] hover:shadow-lg transition-all">
              <div className="flex flex-col justify-center p-8 md:p-10 space-y-3 order-2 md:order-1">
                <h3 className="font-serif text-2xl md:text-3xl text-[#2C302E] font-bold">Monthly Studio Open House</h3>
                <p className="text-xs font-mono text-[#2C302E]/60 uppercase tracking-widest font-bold">
                  First Saturday of every month • Kaku Studio
                </p>
                <p className="text-sm font-medium text-[#2C302E]/80 leading-relaxed">
                  Visit our workspace, browse raw yarns, meet the artisans, and learn the basics of crochet in our free afternoon workshop.
                </p>
              </div>
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[280px] w-full order-1 md:order-2">
                <Image 
                  src="https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop"
                  alt="Studio Open House"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- MINIMALIST FOOTER NOTE --- */}
        <div className="pt-16 border-t border-[#EFEBE4] text-center space-y-2">
          <p className="font-serif text-2xl text-[#2C302E]">
            Handmade in Addis Ababa, Ethiopia
          </p>
          <p className="text-xs text-[#2C302E]/60 uppercase tracking-widest font-mono">
            Preserving indigenous weaving heritage • Global Express Shipping
          </p>
        </div>
      </div>
    </main>
  );
};