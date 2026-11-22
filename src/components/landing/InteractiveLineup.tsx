// ============================================================================
// components/landing/InteractiveLineup.tsx
// ============================================================================
'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatEtb } from '@/lib/money';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface InteractiveLineupProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

/** Prefer one product per category so the lineup spans the catalog. */
function pickDiverseProducts(products: Product[], limit = 5): Product[] {
  if (products.length <= limit) return products;

  const byCategory = new Map<string, Product[]>();
  for (const product of products) {
    const key = product.category || 'other';
    const bucket = byCategory.get(key);
    if (bucket) bucket.push(product);
    else byCategory.set(key, [product]);
  }

  const categories = [...byCategory.keys()];
  const picked: Product[] = [];
  const used = new Set<string>();

  let round = 0;
  while (picked.length < limit && categories.length > 0) {
    let addedThisRound = false;
    for (const category of categories) {
      if (picked.length >= limit) break;
      const bucket = byCategory.get(category) || [];
      const candidate = bucket[round];
      if (candidate && !used.has(candidate.id)) {
        picked.push(candidate);
        used.add(candidate.id);
        addedThisRound = true;
      }
    }
    if (!addedThisRound) break;
    round += 1;
  }

  if (picked.length < limit) {
    for (const product of products) {
      if (picked.length >= limit) break;
      if (!used.has(product.id)) {
        picked.push(product);
        used.add(product.id);
      }
    }
  }

  return picked;
}

const TITLE_WORD_1 = 'OUR'.split('');
const TITLE_WORD_2 = 'COLLECTIONS'.split('');
const TOTAL_LETTERS = TITLE_WORD_1.length + TITLE_WORD_2.length;

const CONTAINER_PRESETS = [
  {
    shape: 'rounded-t-[100px] rounded-b-[32px]',
    tilt: '-rotate-2',
    aspect: 'aspect-[3/4.2]',
    border: 'border-[#D4A373]/60',
    badge: 'bg-[#D4A373] text-white',
  },
  {
    shape: 'rounded-[90px_32px_90px_32px]',
    tilt: 'rotate-3',
    aspect: 'aspect-[3/4.4]',
    border: 'border-[#52796F]/60',
    badge: 'bg-[#52796F] text-white',
  },
  {
    shape: 'rounded-full',
    tilt: '-rotate-1',
    aspect: 'aspect-square',
    border: 'border-[#B85D43]/60',
    badge: 'bg-[#B85D43] text-white',
  },
  {
    shape: 'rounded-b-[100px] rounded-t-[32px]',
    tilt: 'rotate-2',
    aspect: 'aspect-[3/4.3]',
    border: 'border-[#2C302E]/50',
    badge: 'bg-[#2C302E] text-white',
  },
  {
    shape: 'rounded-[48px_100px_48px_100px]',
    tilt: '-rotate-3',
    aspect: 'aspect-[3/4.2]',
    border: 'border-[#D4A373]/70',
    badge: 'bg-[#D4A373] text-white',
  },
];

function ProductTile({
  product,
  idx,
  onSelect,
  hoveredIdx,
  setHoveredIdx,
  style,
}: {
  product: Product;
  idx: number;
  onSelect: (product: Product) => void;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  style?: React.CSSProperties;
}) {
  const preset = CONTAINER_PRESETS[idx % CONTAINER_PRESETS.length];
  const isHovered = hoveredIdx === idx;

  return (
    <div
      style={style}
      onMouseEnter={() => setHoveredIdx(idx)}
      onMouseLeave={() => setHoveredIdx(null)}
      onClick={() => onSelect(product)}
      className={`relative group cursor-pointer flex flex-col items-center ${preset.tilt}`}
    >
      <div className="absolute -top-3 z-30 flex items-center space-x-1 shadow-md">
        <span
          className={`text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${preset.badge}`}
        >
          {product.tag.split(' ')[0]}
        </span>
      </div>

      <div
        className={`relative w-full ${preset.aspect} ${preset.shape} ${preset.border} border-2 overflow-hidden bg-[#FDFBF7] shadow-[0_12px_28px_rgba(44,48,46,0.14)]`}
      >
        <div className="absolute inset-0 bg-[#D4A373]/10 mix-blend-multiply pointer-events-none z-10" />
        <Image
          src={isHovered ? product.hoverImage : product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 45vw, 20vw"
          className="object-cover object-center transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C302E]/75 via-transparent to-transparent z-10" />
        <div className="absolute bottom-3 left-3 right-3 text-white z-20 text-center">
          <p className="font-serif text-sm font-medium leading-tight truncate drop-shadow-md">
            {product.name}
          </p>
          <p className="text-[10px] font-mono text-[#D4A373] tracking-widest mt-0.5 font-bold">
            {formatEtb(product.price)}
          </p>
        </div>
      </div>

      <div className="mt-2.5 text-center px-1">
        <span className="text-[10px] tracking-widest uppercase font-mono text-[#2C302E]/80 font-bold">
          {product.handcraftedHours}h · {product.category}
        </span>
      </div>
    </div>
  );
}

export const InteractiveLineup: React.FC<InteractiveLineupProps> = ({
  products,
  onSelectProduct,
}) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalProgress, setTotalProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayProducts = useMemo(() => pickDiverseProducts(products, 5), [products]);
  const totalItems = displayProducts.length;

  const handleScroll = useCallback(() => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const triggerStart = windowHeight * 0.5;
    const totalDistance = rect.height + triggerStart;
    const currentDistance = triggerStart - rect.top;
    if (totalDistance > 0) {
      setTotalProgress(Math.min(Math.max(currentDistance / totalDistance, 0), 1));
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll, isMobile]);

  const getLetterStyle = (index: number) => {
    const enterSlice = 0.36 / TOTAL_LETTERS;
    const enterStart = index * enterSlice;
    const enterEnd = enterStart + enterSlice * 0.95;
    const exitSlice = 0.11 / TOTAL_LETTERS;
    const exitStart = 0.83 + index * exitSlice;
    const exitEnd = exitStart + exitSlice * 0.95;

    let translateY = '100vh';
    let opacity = 0;

    if (totalProgress < enterStart) {
      translateY = '100vh';
      opacity = 0;
    } else if (totalProgress >= enterStart && totalProgress <= enterEnd) {
      const rawP = (totalProgress - enterStart) / (enterEnd - enterStart);
      const p = 1 - Math.pow(1 - rawP, 3);
      translateY = `${(1 - p) * 100}vh`;
      opacity = p;
    } else if (totalProgress > enterEnd && totalProgress < exitStart) {
      translateY = '0vh';
      opacity = 1;
    } else if (totalProgress >= exitStart && totalProgress <= exitEnd) {
      const rawP = (totalProgress - exitStart) / (exitEnd - exitStart);
      const p = Math.pow(rawP, 3);
      translateY = `${-p * 100}vh`;
      opacity = 1 - p;
    } else {
      translateY = '-100vh';
      opacity = 0;
    }

    return {
      transform: `translate3d(0, ${translateY}, 0)`,
      opacity,
      transition: 'transform 0.35s ease-out, opacity 0.25s ease-out',
    };
  };

  const getItemStyle = (index: number) => {
    const itemSlice = 0.22 / totalItems;
    const enterStart = 0.38 + index * itemSlice;
    const enterEnd = enterStart + itemSlice * 0.95;
    const exitSlice = 0.12 / totalItems;
    const exitStart = 0.68 + index * exitSlice;
    const exitEnd = exitStart + exitSlice * 0.95;

    let translateY = '100vh';
    let opacity = 0;
    let scale = 0.88;

    if (totalProgress < enterStart) {
      translateY = '100vh';
      opacity = 0;
      scale = 0.88;
    } else if (totalProgress >= enterStart && totalProgress <= enterEnd) {
      const rawP = (totalProgress - enterStart) / (enterEnd - enterStart);
      const p = 1 - Math.pow(1 - rawP, 3);
      translateY = `${(1 - p) * 100}vh`;
      opacity = p;
      scale = 0.88 + 0.12 * p;
    } else if (totalProgress > enterEnd && totalProgress < exitStart) {
      translateY = '0vh';
      opacity = 1;
      scale = 1;
    } else if (totalProgress >= exitStart && totalProgress <= exitEnd) {
      const rawP = (totalProgress - exitStart) / (exitEnd - exitStart);
      const p = Math.pow(rawP, 3);
      translateY = `${-p * 100}vh`;
      opacity = 1 - p;
      scale = 1 - 0.12 * p;
    } else {
      translateY = '-100vh';
      opacity = 0;
      scale = 0.88;
    }

    return {
      transform: `translate3d(0, ${translateY}, 0) scale(${scale})`,
      opacity,
      transition: 'transform 0.4s ease-out, opacity 0.3s ease-out',
    };
  };

  let textBlur = 0;
  let textOpacity = 0.85;

  if (totalProgress >= 0.38 && totalProgress <= 0.60) {
    const p = (totalProgress - 0.38) / 0.22;
    textBlur = p * 7;
    textOpacity = 0.85 - p * 0.45;
  } else if (totalProgress > 0.60 && totalProgress < 0.68) {
    textBlur = 7;
    textOpacity = 0.4;
  } else if (totalProgress >= 0.68 && totalProgress <= 0.80) {
    const p = (totalProgress - 0.68) / 0.12;
    textBlur = 7 * (1 - p);
    textOpacity = 0.4 + p * 0.45;
  }

  // ——— Mobile: static grid, no sticky scroll theater ———
  if (isMobile) {
    return (
      <section className="relative w-full bg-[#EFEBE4]/70 border-y border-[#EFEBE4] py-12 px-4 overflow-x-hidden">
        <div className="text-center mb-8 space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#B85D43]">
            Lookbook
          </p>
          <h2 className="font-serif text-4xl text-[#2C302E] leading-none tracking-tight">
            Our <span className="italic text-[#B85D43]">Collections</span>
          </h2>
          <p className="text-xs text-[#2C302E]/55 max-w-xs mx-auto pt-1">
            Tap a piece to open the full product story.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 max-w-lg mx-auto">
          {displayProducts.map((product, idx) => (
            <div
              key={product.id}
              className={idx === displayProducts.length - 1 && displayProducts.length % 2 === 1 ? 'col-span-2 max-w-[55%] mx-auto w-full' : ''}
            >
              <ProductTile
                product={product}
                idx={idx}
                onSelect={onSelectProduct}
                hoveredIdx={hoveredIdx}
                setHoveredIdx={setHoveredIdx}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ——— Desktop: sticky scroll theater ———
  return (
    <section
      ref={containerRef}
      className="relative w-full h-[650vh] bg-[#EFEBE4]/70 border-y border-[#EFEBE4]"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center overflow-hidden px-4 md:px-12 py-8 select-none z-10">
        <div
          className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300"
          style={{
            filter: `blur(${textBlur}px)`,
            opacity: textOpacity,
          }}
        >
          <div className="flex justify-center space-x-4 md:space-x-8 text-[18vw] md:text-[14vw] font-serif font-black leading-none text-[#B85D43] tracking-tighter drop-shadow-sm">
            {TITLE_WORD_1.map((char, i) => (
              <span key={`w1-${i}`} style={getLetterStyle(i)} className="inline-block will-change-transform">
                {char}
              </span>
            ))}
          </div>
          <div className="flex justify-center space-x-1.5 md:space-x-4 text-[13vw] md:text-[10.5vw] font-serif font-black leading-none text-[#2C302E] tracking-tighter -mt-2 md:-mt-6 drop-shadow-sm">
            {TITLE_WORD_2.map((char, i) => (
              <span
                key={`w2-${i}`}
                style={getLetterStyle(TITLE_WORD_1.length + i)}
                className="inline-block will-change-transform"
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-center my-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5 lg:gap-6 w-full items-center">
            {displayProducts.map((product, idx) => (
              <ProductTile
                key={product.id}
                product={product}
                idx={idx}
                onSelect={onSelectProduct}
                hoveredIdx={hoveredIdx}
                setHoveredIdx={setHoveredIdx}
                style={getItemStyle(idx)}
              />
            ))}
          </div>
        </div>

        <div className="relative z-30 flex flex-col items-center space-y-2 mb-2">
          <div className="w-48 h-1.5 bg-[#2C302E]/15 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#B85D43] transition-all duration-100 rounded-full"
              style={{ width: `${Math.round(totalProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
