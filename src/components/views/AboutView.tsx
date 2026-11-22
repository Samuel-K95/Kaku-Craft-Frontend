// ============================================================================
// components/views/AboutView.tsx
// ============================================================================
'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Scissors, Compass, HeartHandshake, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useProductsQuery } from '@/lib/products';
import { Product } from '@/types';
import { formatEtb } from '@/lib/money';

const SOCIALS = [
  { label: 'Telegram', href: 'https://t.me/keku_craft' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@kakucraft621' },
  { label: 'Instagram', href: 'https://www.instagram.com/keku_craft_779/' },
];

/** Intentional organic masks — same footprint, different silhouettes. */
const FRAME_SHAPES = [
  {
    mask: 'rounded-t-[100px] rounded-b-[28px]',
    border: 'border-[#D4A373]/55',
    tilt: '-rotate-1',
  },
  {
    mask: 'rounded-[80px_28px_80px_28px]',
    border: 'border-[#52796F]/45',
    tilt: 'rotate-1',
  },
  {
    mask: 'rounded-full',
    border: 'border-[#B85D43]/45',
    tilt: '-rotate-[0.5deg]',
  },
  {
    mask: 'rounded-b-[100px] rounded-t-[28px]',
    border: 'border-[#2C302E]/35',
    tilt: 'rotate-1',
  },
  {
    mask: 'rounded-[40px_90px_40px_90px]',
    border: 'border-[#D4A373]/50',
    tilt: '-rotate-1',
  },
  {
    mask: 'rounded-[90px_40px_90px_40px]',
    border: 'border-[#52796F]/40',
    tilt: 'rotate-[0.5deg]',
  },
] as const;

function pickGallery(products: Product[], count: number): Product[] {
  if (!products.length) return [];
  const byCat = new Map<string, Product>();
  for (const p of products) {
    if (!byCat.has(p.category)) byCat.set(p.category, p);
  }
  const diverse = [...byCat.values()];
  const rest = products.filter((p) => !diverse.some((d) => d.id === p.id));
  return [...diverse, ...rest].slice(0, count);
}

export const AboutView: React.FC = () => {
  const { data: products = [], isLoading } = useProductsQuery();
  const gallery = useMemo(() => pickGallery(products, 6), [products]);
  const hero = gallery.slice(0, 4);
  const featured = gallery[0];

  return (
    <main className="relative min-h-screen py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none overflow-x-hidden">
      <div className="max-w-7xl mx-auto relative z-10 space-y-12 sm:space-y-16 md:space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 backdrop-blur-sm px-4 sm:px-5 py-2 rounded-full border border-[#EFEBE4]">
            <span>ከኩ craft · About</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2C302E] leading-[1.05] tracking-tight px-1">
            From yarn to glam —{' '}
            <span className="italic font-normal text-[#B85D43]">made by hand.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#2C302E]/70 leading-relaxed font-sans max-w-lg mx-auto font-medium">
            ከኩ craft (Keku craft) is an Addis Ababa studio for crochet jewelry, wearables, and custom pieces —
            loop by loop, never by machine.
          </p>
        </div>

        {/* Hero frames — equal columns, organic silhouettes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-7 max-w-5xl mx-auto items-end">
          {(hero.length ? hero : Array.from({ length: 4 })).map((item, i) => {
            const product = typeof item === 'object' && item && 'image' in item ? (item as Product) : null;
            const frame = FRAME_SHAPES[i % FRAME_SHAPES.length];
            return (
              <div
                key={product?.id || `placeholder-${i}`}
                className={`relative flex flex-col items-center ${frame.tilt}`}
              >
                <div
                  className={`relative w-full aspect-[3/4] overflow-hidden border-2 bg-[#EFEBE4] ${frame.mask} ${frame.border}`}
                >
                  {product ? (
                    <>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                        priority={i === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C302E]/55 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-[#2C302E]/40 font-medium">
                      {isLoading ? 'Loading…' : 'Soon'}
                    </div>
                  )}
                </div>
                {product && (
                  <div className="mt-3 text-center px-1">
                    <p className="font-serif text-sm text-[#2C302E] leading-tight line-clamp-1">{product.name}</p>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#B85D43] mt-0.5">
                      {product.tag}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4A373] font-mono">
              Our Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C302E] leading-tight">
              Jewelry & crochet that slays — crafted in Addis Ababa.
            </h2>
            <div className="w-16 h-0.5 bg-[#D4A373]" />
          </div>

          <div className="lg:col-span-7 space-y-6 text-[#2C302E]/80 font-sans text-sm sm:text-base leading-relaxed font-medium">
            <p>
              <strong>ከኩ craft</strong> started as a love for yarn, color, and pieces you can wear every day —
              from keychain dolls and baby knits to cardigans, shrugs, and crop tops.
            </p>
            <p>
              Every item is crocheted by hand. That means real hours of tension, finishing, and care — not
              factory yards cut from a roll. When you order from us, you are ordering a piece that did not exist
              until someone sat down and made it.
            </p>
            <p>
              We share work-in-progress and finished drops on Telegram and TikTok, take custom color and size
              requests, and ship from Addis Ababa. Prices are in ETB
              {featured ? ` — pieces in the shop start around ${formatEtb(Math.min(...products.map((p) => p.price)))}` : ''}
              .
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#B85D43] transition-colors"
              >
                Browse the shop
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2C302E]/20 text-[#2C302E] text-[10px] uppercase tracking-[0.2em] font-bold hover:border-[#B85D43] hover:text-[#B85D43] transition-colors"
              >
                Request custom
              </Link>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] bg-[#EFEBE4]/75 border border-[#EFEBE4] space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-[#B85D43]/15 flex items-center justify-center text-[#B85D43]">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#2C302E] font-bold">Hand-looped only</h3>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-sans font-medium">
              No industrial crochet. Each cardigan, doll, or charm is shaped stitch by stitch with consistent
              tension and finishing.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] bg-[#EFEBE4]/75 border border-[#EFEBE4] space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-[#52796F]/15 flex items-center justify-center text-[#52796F]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#2C302E] font-bold">Made to order when needed</h3>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-sans font-medium">
              In-stock pieces ship quickly. Pre-orders and customs get a clear make-time so you know when your
              piece will be ready.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] bg-[#EFEBE4]/75 border border-[#EFEBE4] space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-[#D4A373]/20 flex items-center justify-center text-[#D4A373]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#2C302E] font-bold">Your colors, your fit</h3>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-sans font-medium">
              Tell us Medium through XXL, a colorway, or a custom doll idea — we will make it for you from the
              Addis Ababa studio.
            </p>
          </div>
        </div>

        {/* Live atelier gallery */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4A373] font-mono">
                From the atelier
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C302E]">Pieces we actually make.</h2>
            </div>
            <Link
              href="/shop"
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B85D43] hover:underline"
            >
              See all in shop →
            </Link>
          </div>

          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:gap-x-8 md:gap-y-12">
              {gallery.map((product, i) => {
                const frame = FRAME_SHAPES[i % FRAME_SHAPES.length];
                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.id}`}
                    className={`group flex flex-col items-center ${frame.tilt}`}
                  >
                    <div
                      className={`relative w-full aspect-[3/4] overflow-hidden border-2 bg-[#EFEBE4] ${frame.mask} ${frame.border}`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C302E]/50 via-transparent to-transparent" />
                    </div>
                    <div className="mt-3 text-center px-1">
                      <p className="font-serif text-base text-[#2C302E] leading-tight line-clamp-1 group-hover:text-[#B85D43] transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#2C302E]/50 mt-1">
                        {product.category.replace(/-/g, ' ')} · {formatEtb(product.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#E8E2D9] py-16 text-center text-sm text-[#2C302E]/50">
              {isLoading ? 'Loading atelier pieces…' : 'Catalog pieces will appear here once the shop is live.'}
            </div>
          )}
        </div>

        {/* Connect — replaces fake events */}
        <div className="rounded-[28px] sm:rounded-[36px] border border-[#EFEBE4] bg-[#EFEBE4]/50 backdrop-blur-sm p-6 sm:p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4A373] font-mono">
                Stay close
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2C302E] leading-tight">
                Follow the making — then order what you love.
              </h2>
              <p className="text-sm text-[#2C302E]/70 font-medium leading-relaxed max-w-xl">
                New drops, customs, and studio clips land first on Telegram and TikTok. Reach out anytime for a
                custom color, size, or design.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[#FDFBF7] border border-[#EFEBE4] text-sm font-bold text-[#2C302E] hover:border-[#B85D43] hover:text-[#B85D43] transition-colors"
                >
                  {s.label}
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#EFEBE4] text-center space-y-2">
          <p className="font-serif text-2xl text-[#2C302E]">Handmade in Addis Ababa, Ethiopia</p>
          <p className="text-xs text-[#2C302E]/60 uppercase tracking-widest font-mono">
            ከኩ craft · Jewelry & crochet · Prices in ETB
          </p>
        </div>
      </div>
    </main>
  );
};
