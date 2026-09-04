// ============================================================================
// components/landing/CraftPillars.tsx
// ============================================================================
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  Fingerprint,
  HeartHandshake
} from 'lucide-react';

interface PillarData {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  bgShape: string;
  badge: string;
  stats: { value: string; label: string };
  image: string;
}

const PILLARS: PillarData[] = [
  {
    id: 'pillar-1',
    number: '01',
    title: 'Single-Artisan Provenance',
    tagline: 'One master hand from cast-on to final knot.',
    description:
      'Industrial machines cannot synthesize true crochet. Each garment is sculpted individually by an Ethiopian artisan over 24+ focused hours, signed, and certified with an heirloom registry number.',
    icon: Fingerprint,
    accentColor: '#B85D43',
    bgShape: 'rounded-tr-[120px] rounded-bl-[120px] rounded-tl-3xl rounded-br-3xl',
    badge: '100% Unmechanized',
    stats: { value: '28h', label: 'Average Craft Time' },
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'pillar-2',
    number: '02',
    title: 'Additive Zero-Waste Anatomy',
    tagline: 'Loop by continuous loop. Zero fabric offcuts.',
    description:
      'Traditional fashion wastes up to 15% of fabric in cutting room scraps. Our additive loop physics consume strictly the exact yardage needed, producing 0% landfill footprint.',
    icon: Layers,
    accentColor: '#52796F',
    bgShape: 'rounded-full',
    badge: '0% Micro-Waste',
    stats: { value: '0.0%', label: 'Cutting Scrap Ratio' },
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'pillar-3',
    number: '03',
    title: 'Perpetual Mending Pact',
    tagline: 'Heirlooms built for generational inheritance.',
    description:
      'We supply complimentary fiber-matching repair kits and unconditional lifetime mending. If a stitch ever loosens, our atelier re-weaves it back to original structural integrity.',
    icon: HeartHandshake,
    accentColor: '#D4A373',
    bgShape: 'rounded-tl-[120px] rounded-br-[120px] rounded-tr-3xl rounded-bl-3xl',
    badge: 'Lifetime Guarantee',
    stats: { value: '∞', label: 'Artisan Mending Care' },
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=900&auto=format&fit=crop',
  },
];

export const CraftPillars: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const activePillar = PILLARS[activeTab];

  return (
    // Alternating Frosted Glass Section: Oatmeal tint with backdrop blur
    <section className="relative py-28 px-4 md:px-12 bg-[#EFEBE4]/75 backdrop-blur-lg overflow-hidden border-y border-[#EFEBE4]/80">
      {/* Background Micro Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2C302E_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase font-bold tracking-[0.3em] text-[#D4A373] mb-3">
              <span>The Atelier Manifesto</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-[#2C302E] tracking-tight leading-none">
              The Geometry of <br />
              <span className="italic font-normal text-[#B85D43]">Slow Stitches.</span>
            </h2>
          </div>

          <p className="text-xs md:text-sm text-[#2C302E]/70 max-w-sm leading-relaxed font-sans">
            Unlike commercial garments cut from pre-made rolls of cloth, every Kaku Craft artifact is a single, uninterrupted filament sculptural journey.
          </p>
        </div>

        {/* --- MAIN INTERACTIVE 3D STAGE & PILLAR SELECTOR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Pillar Navigational Stepper */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {PILLARS.map((pillar, idx) => {
              const isActive = activeTab === idx;
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.id}
                  onMouseEnter={() => setActiveTab(idx)}
                  className={`cursor-pointer rounded-3xl p-6 md:p-7 border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden group ${
                    isActive
                      ? 'bg-[#FDFBF7]/90 border-[#2C302E] shadow-lg translate-x-2 backdrop-blur-md'
                      : 'bg-[#FDFBF7]/50 border-[#EFEBE4] hover:border-[#D4A373] hover:bg-[#FDFBF7]/70 opacity-75 hover:opacity-100 backdrop-blur-sm'
                  }`}
                >
                  <div 
                    className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundColor: pillar.accentColor }} 
                  />

                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm"
                        style={{
                          backgroundColor: isActive ? pillar.accentColor : '#EFEBE4',
                          color: isActive ? '#FFFFFF' : '#2C302E',
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#2C302E]/50 font-bold">
                          Standard {pillar.number}
                        </span>
                        <h3 className="font-serif text-xl md:text-2xl text-[#2C302E] font-medium leading-tight">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    <ArrowUpRight 
                      className={`w-4 h-4 text-[#2C302E] transition-all duration-500 ${
                        isActive ? 'rotate-45 text-[#B85D43]' : 'group-hover:translate-x-0.5'
                      }`} 
                    />
                  </div>

                  <p className="mt-3 text-xs text-[#2C302E]/70 line-clamp-2 leading-relaxed font-sans">
                    {pillar.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Dynamic Editorial Display Stage */}
          <div className="lg:col-span-7 bg-[#FDFBF7]/85 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-[#2C302E]/10 flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[480px]">
            
            {/* Ambient Watermark Crest */}
            <div className="absolute -right-12 -bottom-12 font-serif text-[18vw] font-black text-[#2C302E]/[0.03] select-none pointer-events-none leading-none transition-all duration-700">
              {activePillar.number}
            </div>

            {/* Top Stage Header */}
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] px-3.5 py-1.5 rounded-full bg-[#EFEBE4] text-[#2C302E] border border-[#2C302E]/10 shadow-sm transition-all duration-500">
                {activePillar.badge}
              </span>

              <div className="text-right">
                <p 
                  className="font-mono text-3xl md:text-4xl font-black leading-none transition-colors duration-500"
                  style={{ color: activePillar.accentColor }}
                >
                  {activePillar.stats.value}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-[#2C302E]/60 font-semibold mt-1">
                  {activePillar.stats.label}
                </p>
              </div>
            </div>

            {/* Center Visual */}
            <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
              <div className="relative aspect-square w-full max-w-[260px] mx-auto">
                <div 
                  className={`w-full h-full ${activePillar.bgShape} overflow-hidden shadow-[0_20px_35px_rgba(44,48,46,0.16)] border-2 border-[#FDFBF7] relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                >
                  <Image
                    key={activePillar.id}
                    src={activePillar.image}
                    alt={activePillar.title}
                    fill
                    sizes="(max-width: 768px) 260px, 320px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 animate-in fade-in duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C302E]/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Body Manifesto */}
              <div className="space-y-3 text-left">
                <h4 className="font-serif text-2xl md:text-3xl text-[#2C302E] leading-snug">
                  {activePillar.tagline}
                </h4>
                <p className="text-xs md:text-sm text-[#2C302E]/75 leading-relaxed font-sans">
                  {activePillar.description}
                </p>
              </div>
            </div>

            {/* Bottom Proof Quote */}
            <div className="pt-6 border-t border-[#2C302E]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-[#2C302E]/60 uppercase tracking-widest font-mono z-10 gap-2 sm:gap-0">
              <span>Authentic Ethiopian Textile Heritage</span>
              <span className="text-[#B85D43] font-bold">Document Ref • KC-{activePillar.number}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};