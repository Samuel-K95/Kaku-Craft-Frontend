'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import {
  TIKTOK_PROFILE_URL,
  TIKTOK_SPOTLIGHT_CLIPS,
  tiktokEmbedSrc,
} from '@/data/tiktokSpotlight';

const CLIPS = TIKTOK_SPOTLIGHT_CLIPS;
const N = CLIPS.length;

export const TikTokSpotlight: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const lockProgressRef = useRef(0);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const raw = -rect.top / total;
    setProgress(Math.min(1, Math.max(0, raw)));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const scrollIndex = Math.min(N - 1, Math.floor(progress * N * 0.999));
  const activeIndex = manualIndex ?? scrollIndex;

  useEffect(() => {
    if (manualIndex !== null && Math.abs(progress - lockProgressRef.current) > 0.06) {
      setManualIndex(null);
    }
  }, [progress, manualIndex]);

  const lockTo = (index: number) => {
    lockProgressRef.current = progress;
    setManualIndex(Math.min(N - 1, Math.max(0, index)));
  };

  const goPrev = () => lockTo(activeIndex - 1);
  const goNext = () => lockTo(activeIndex + 1);

  const segmentSize = 1 / N;
  const localT = Math.min(1, Math.max(0, (progress - activeIndex * segmentSize) / segmentSize));

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[280vh] bg-transparent border-y border-[#EFEBE4]/80"
    >
      {/* Transparent sticky stage so floating yarns stay visible behind */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col bg-transparent">
        {/* Soft theme wash only — no solid fill */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 55% 40% at ${28 + progress * 35}% 28%, rgba(184,93,67,0.10), transparent 62%),
              radial-gradient(ellipse 45% 35% at ${72 - progress * 28}% 72%, rgba(212,163,115,0.10), transparent 58%)
            `,
          }}
        />

        {/* Header */}
        <div className="relative z-20 px-4 md:px-12 pt-8 md:pt-10 flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#B85D43]">
              Studio Spotlight · 0{activeIndex + 1} / 0{N}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C302E] leading-none tracking-tight">
              Stitches in{' '}
              <span className="italic font-normal text-[#B85D43]">motion.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#2C302E]/60 max-w-md font-medium leading-relaxed">
              Scroll to move through the reels — or use the arrows. Full feed lives on TikTok.
            </p>
          </div>
          <a
            href={TIKTOK_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-full bg-[#2C302E] text-[#FDFBF7] text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#B85D43] transition-colors"
          >
            View more on TikTok
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Stage */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-2 md:px-6 min-h-0">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex === 0}
            aria-label="Previous clip"
            className="absolute left-2 md:left-8 z-30 w-11 h-11 rounded-full border border-[#2C302E]/15 bg-[#FDFBF7]/80 text-[#2C302E] flex items-center justify-center backdrop-blur-md shadow-sm disabled:opacity-25 hover:border-[#B85D43] hover:text-[#B85D43] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex === N - 1}
            aria-label="Next clip"
            className="absolute right-2 md:right-8 z-30 w-11 h-11 rounded-full border border-[#2C302E]/15 bg-[#FDFBF7]/80 text-[#2C302E] flex items-center justify-center backdrop-blur-md shadow-sm disabled:opacity-25 hover:border-[#B85D43] hover:text-[#B85D43] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="relative w-full max-w-6xl h-[min(78vh,720px)] flex items-center justify-center">
            {CLIPS.map((clip, index) => {
              const offset = index - activeIndex;
              const abs = Math.abs(offset);
              if (abs > 1) {
                return (
                  <div
                    key={clip.id}
                    aria-hidden
                    className="absolute opacity-0 pointer-events-none"
                    style={{ transform: 'scale(0.7)' }}
                  />
                );
              }

              const isCenter = offset === 0;
              const side = offset < 0 ? -1 : 1;
              const x = isCenter ? 0 : side * 52;
              const scale = isCenter ? 1 + localT * 0.01 : 0.8;
              const opacity = isCenter ? 1 : 0.38;
              const rotateY = isCenter ? 0 : side * -14;
              const z = isCenter ? 20 : 10;

              return (
                <div
                  key={clip.id}
                  className="absolute transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: 'min(380px, 86vw)',
                    transform: `translateX(${x}%) scale(${scale}) perspective(1100px) rotateY(${rotateY}deg)`,
                    opacity,
                    zIndex: z,
                    pointerEvents: isCenter ? 'auto' : 'none',
                  }}
                >
                  <div
                    className={`relative rounded-[36px] overflow-hidden border bg-[#FDFBF7]/90 backdrop-blur-[2px] ${
                      isCenter
                        ? 'border-[#D4A373]/60 shadow-[0_28px_60px_rgba(44,48,46,0.14)]'
                        : 'border-[#E8E2D9]'
                    }`}
                  >
                    {isCenter && (
                      <div className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#B85D43] to-transparent animate-spotlight-scan" />
                    )}
                    <iframe
                      src={tiktokEmbedSrc(clip.id)}
                      title={clip.title}
                      className="w-full h-[min(70vh,620px)] bg-[#EFEBE4]"
                      allow="encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                      loading={abs === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                  {isCenter && (
                    <p className="mt-4 text-center text-[11px] font-mono uppercase tracking-[0.22em] text-[#2C302E]/55">
                      {clip.title}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll progress */}
        <div className="relative z-20 px-4 md:px-12 pb-7 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#2C302E]/35 shrink-0">
              Scroll
            </span>
            <div className="relative flex-1 h-[2px] bg-[#2C302E]/10 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#B85D43] to-[#D4A373] rounded-full transition-[width] duration-150 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex gap-1.5 shrink-0">
              {CLIPS.map((clip, i) => (
                <button
                  key={clip.id}
                  type="button"
                  aria-label={`Go to clip ${i + 1}`}
                  onClick={() => lockTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-7 bg-[#B85D43]'
                      : 'w-1.5 bg-[#2C302E]/20 hover:bg-[#2C302E]/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
