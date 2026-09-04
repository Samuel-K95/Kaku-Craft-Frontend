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
            <span>The Atelier Manifesto</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#2C302E] leading-none tracking-tight">
            The Philosophy of <br />
            <span className="italic font-normal text-[#B85D43]">Slow Stitches.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#2C302E]/70 leading-relaxed font-sans max-w-lg mx-auto">
            An exploration of unmechanized fiber art, meditative patience, and heirloom craftsmanship sculpted in the Ethiopian highlands.
          </p>
        </div>

        {/* --- FULL-WIDTH EDITORIAL HERO SHOWCASE --- */}
        <div className="relative aspect-[21/9] w-full rounded-[40px] overflow-hidden border-2 border-[#EFEBE4] shadow-md">
          <Image 
            src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop"
            alt="Hands crocheting with wooden hooks and organic wool"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C302E]/70 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs font-mono">
            <span className="bg-[#2C302E]/80 backdrop-blur-md px-4 py-2 rounded-full uppercase tracking-widest text-[10px]">
              Addis Ababa Atelier • Studio 01
            </span>
            <span className="hidden sm:inline-block text-[#D4A373] uppercase tracking-widest font-bold text-[10px] bg-[#2C302E]/80 backdrop-blur-md px-4 py-2 rounded-full">
              100% Unmechanized Process
            </span>
          </div>
        </div>

        {/* --- NARRATIVE TWO-COLUMN EDITORIAL GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4A373] font-mono">
              Founding Principle
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C302E] leading-tight">
              &ldquo;To knit is to craft structure; to crochet is to sculpt emotion stitch by stitch.&rdquo;
            </h2>
            <div className="w-16 h-0.5 bg-[#D4A373]" />
          </div>

          <div className="lg:col-span-7 space-y-6 text-[#2C302E]/80 font-sans text-sm sm:text-base leading-relaxed">
            <p>
              Founded in Addis Ababa, <strong>Kaku Craft</strong> is an experimental textile studio committed to preserving the meditative art of manual crochet while re-interpreting it through contemporary silhouettes and architectural garment forms.
            </p>
            <p>
              Unlike industrial knitting looms, true crochet stitches cannot be synthesized by automated machinery. Every single spiral, loop, and tension-pull is an irreproducible human gesture. When you wear a Kaku Craft creation, you are wearing hours of focused human patience.
            </p>
            <p>
              Our additive loop methodology guarantees that zero fabric is discarded to landfill during production. From double-spun Ethiopian highland mohair to botanical vegetable dyes, every raw filament is consciously stewarded.
            </p>
          </div>
        </div>

        {/* --- THREE CORE PILLARS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="p-8 rounded-[32px] bg-[#EFEBE4]/75 border border-[#EFEBE4] space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-[#B85D43]/15 flex items-center justify-center text-[#B85D43]">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#2C302E] font-medium">Single Artisan Provenance</h3>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-sans">
              One master artisan shapes your garment from the initial cast-on to final knot, numbered and signed upon completion.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-[#EFEBE4]/75 border border-[#EFEBE4] space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-[#52796F]/15 flex items-center justify-center text-[#52796F]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#2C302E] font-medium">Zero-Waste Loop Anatomy</h3>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-sans">
              Our additive loop physics consume strictly the exact yardage required, resulting in virtually 0% cutting scraps.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-[#EFEBE4]/75 border border-[#EFEBE4] space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-[#D4A373]/20 flex items-center justify-center text-[#D4A373]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#2C302E] font-medium">Perpetual Mending Pact</h3>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-sans">
              Every commission includes fiber-matching restoration kits and unconditional lifetime atelier mending support.
            </p>
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