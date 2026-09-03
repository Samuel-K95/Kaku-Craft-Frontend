// ============================================================================
// components/landing/HeroSection.tsx
// ============================================================================
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Scissors, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  yarnAssetSrc?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onExploreClick,
  yarnAssetSrc = '/images/crochet_yarn_needles.png'
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, tiltX: 0, tiltY: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { innerWidth, innerHeight } = window;
      
      const rawX = (e.clientX - innerWidth / 2);
      const rawY = (e.clientY - innerHeight / 2);

      // Amplified delta coordinates for a more distinct, tangible reaction
      const x = rawX / 18; 
      const y = rawY / 18;
      const tiltX = -(rawY / innerHeight) * 24; // Increased 3D pitch tilt
      const tiltY = (rawX / innerWidth) * 24;   // Increased 3D yaw tilt

      setMousePos({ x, y, tiltX, tiltY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[95vh] flex flex-col justify-between items-center px-4 md:px-12 overflow-hidden bg-[#FDFBF7] select-none pt-4"
    >
      {/* Micro-grain & Organic Tactile Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#2C302E_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* --- TOP BRAND EDITORIAL BANNER --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center pt-4 pb-2">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="w-11 h-11 rounded-full border border-[#2C302E]/20 bg-[#EFEBE4]/60 flex items-center justify-center p-2 shadow-sm">
            <Scissors className="w-5 h-5 text-[#2C302E] -rotate-45" />
          </div>
          <div className="text-[11px] uppercase tracking-[0.2em] font-medium leading-tight">
            <p className="text-[#2C302E] font-bold">Handcrafted Artifacts</p>
            <p className="text-[#D4A373]">Single Hook Mastery</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#1C4E4F] animate-ping" />
          <p className="max-w-xs text-xs md:text-sm text-[#2C302E]/80 tracking-wide font-normal leading-relaxed text-left md:text-right">
            Where heritage fiber sculpture meets modern editorial silhouette.
          </p>
        </div>
      </div>

      {/* --- MAIN HERO STAGE (ROYAL BEVERAGE 3D LAYERED COMPOSITION) --- */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center py-4 min-h-[520px] md:min-h-[640px]">
        
        {/* Layer 1: Giant Backdrop Typography (Counter-Parallax Depth Layer) */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-center pointer-events-none z-0 overflow-hidden"
          style={{
            transform: `translate3d(${mousePos.x * -0.45}px, ${mousePos.y * -0.45}px, 0) perspective(1000px) rotateX(${mousePos.tiltX * -0.35}deg) rotateY(${mousePos.tiltY * -0.35}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h1 className="font-serif font-black text-[17vw] lg:text-[18vw] leading-[0.88] text-[#B85D43] opacity-95 uppercase drop-shadow-md flex flex-col items-center justify-center select-none will-change-transform">
            <span className="block tracking-[-0.04em]">KAKU</span>
            <span className="block tracking-[-0.02em] -mt-[1.5vw] md:-mt-[2vw] lg:-mt-[2.2vw]">
              CRAFT
            </span>
          </h1>
        </div>

        {/* Layer 2: Editorial Floating Badge (Amplified High-Orbit Parallax) */}
        <div 
          className="absolute left-4 md:left-12 lg:left-16 top-1/4 -translate-y-1/2 z-10 hidden sm:flex flex-col items-center justify-center pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x * -1.2}px, ${mousePos.y * -1.2}px, 0) rotate(${mousePos.x * -0.3 - 12}deg)`,
            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#1C4E4F] p-1 flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm shadow-2xl">
            <div className="w-full h-full rounded-full border border-dashed border-[#1C4E4F]/40 flex flex-col items-center justify-center p-2 text-center">
              <span className="font-serif font-black text-2xl text-[#1C4E4F] leading-none">ከኩ</span>
              <span className="text-[7px] tracking-[0.25em] font-sans uppercase font-bold text-[#2C302E] mt-1">100% PURE</span>
              <span className="text-[6px] tracking-widest uppercase font-mono text-[#D4A373]">ARTISAN SPUN</span>
            </div>
          </div>
        </div>

        {/* Layer 3: Lowered 3D Yarn Spools & Crochet Hooks Cutout Asset (Foreground 3D Parallax & Tilt) */}
        <div 
          className="absolute inset-x-0 bottom-[-2%] md:bottom-[0%] flex items-end justify-center pointer-events-none z-20"
          style={{
            transform: `translate3d(${mousePos.x * 1.3}px, ${mousePos.y * 1.3}px, 0) perspective(1000px) rotateX(${mousePos.tiltX}deg) rotateY(${mousePos.tiltY}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] md:w-[540px] md:h-[540px] lg:w-[620px] lg:h-[620px]">
            
            {/* Dynamic Ambient Cast Shadow that follows light angle */}
            <div 
              className="absolute bottom-4 sm:bottom-8 left-1/2 w-[85%] h-12 bg-[#2C302E]/35 rounded-[100%] filter blur-2xl transform scale-y-50 -z-10 transition-transform duration-150"
              style={{
                transform: `translateX(-50%) translate3d(${mousePos.x * 0.4}px, 0, 0)`,
              }}
            />
            
            {/* Real Yarn Cutout Asset with Natural Drop Shadow */}
            <Image
              src={yarnAssetSrc}
              alt="Hand-spun vibrant crochet yarn spools with metallic and ergonomic crochet needles"
              fill
              priority
              sizes="(max-width: 640px) 320px, (max-width: 1024px) 540px, 620px"
              className="object-contain object-bottom filter drop-shadow-[0_25px_35px_rgba(44,48,46,0.35)] pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        </div>

        {/* Layer 4: Editorial Floating Feature Tag (Counter Parallax Tag) */}
        <div 
          className="absolute right-4 md:right-12 lg:right-16 top-1/3 z-10 hidden sm:block pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x * 0.85}px, ${mousePos.y * 0.85}px, 0)`,
            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="bg-[#FDFBF7]/95 backdrop-blur-md border border-[#EFEBE4] p-4 rounded-2xl shadow-xl max-w-[200px] space-y-1">
            <div className="flex items-center space-x-1.5 text-[#D4A373]">
              <span className="text-[9px] uppercase font-bold tracking-widest font-mono">Organic Fibers</span>
            </div>
            <p className="text-[11px] text-[#2C302E] leading-snug font-medium">
              Vibrant silk-spun spools with hand-finished ergonomic aluminum & bamboo needles.
            </p>
          </div>
        </div>
      </div>

      {/* --- BOTTOM CALL-TO-ACTION & METADATA BAR --- */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center pb-8 border-t border-[#EFEBE4] pt-6 gap-4 sm:gap-0">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#52796F]" />
          <p className="text-xs tracking-wider uppercase font-semibold text-[#2C302E]">
            Hand-crocheted in Addis Ababa • Global Dispatch
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onExploreClick} 
            className="px-8 py-3.5 rounded-full bg-[#2C302E] text-[#FDFBF7] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#D4A373] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 group"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};