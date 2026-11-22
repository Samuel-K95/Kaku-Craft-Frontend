// ============================================================================
// components/views/ShopView.tsx
// ============================================================================
'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import {
  AvailabilityFilter,
  isInStock,
} from '@/lib/stock';
import {
  buildPricePresets,
  formatEtb,
  getPriceBounds,
} from '@/lib/money';

interface ShopViewProps {
  products: Product[];
  categories?: { id: string; label: string }[];
  initialSearch?: string;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const DEFAULT_CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'cardigans', label: 'Cardigans' },
  { id: 'sweaters', label: 'Sweaters' },
  { id: 'handbags', label: 'Handbags' },
  { id: 'beanies', label: 'Beanies' },
  { id: 'small-dolls', label: 'Small Dolls' },
  { id: 'keychain-dolls', label: 'Keychain Dolls' },
  { id: 'blankets', label: 'Blankets' },
  { id: 'scarves', label: 'Scarves' },
  { id: 'gloves', label: 'Gloves' },
  { id: 'socks', label: 'Socks & Booties' },
  { id: 'baby', label: 'Baby Clothes' },
];

const SIZE_OPTIONS = ['Medium', 'Large', 'XL', 'XXL'] as const;

const COLOR_NAME_MAP: Record<string, string[]> = {
  terracotta: ['#B85D43'],
  rust: ['#B85D43'],
  brick: ['#B85D43'],
  red: ['#B85D43'],
  sage: ['#52796F', '#A3B19B', '#CCD5AE'],
  green: ['#52796F', '#A3B19B', '#CCD5AE'],
  olive: ['#52796F', '#2C302E'],
  moss: ['#A3B19B'],
  ochre: ['#D4A373', '#C2B8A3'],
  camel: ['#D4A373'],
  tan: ['#D4A373'],
  gold: ['#D4A373'],
  sand: ['#C2B8A3', '#D4A373'],
  beige: ['#C2B8A3', '#D4A373'],
  oatmeal: ['#C2B8A3', '#EFEBE4'],
  cream: ['#FDFBF7', '#EFEBE4'],
  white: ['#FDFBF7', '#EFEBE4'],
  ivory: ['#FDFBF7', '#EFEBE4'],
  charcoal: ['#2C302E'],
  black: ['#2C302E'],
  dark: ['#2C302E'],
  blush: ['#E78EA9'],
  pink: ['#E78EA9'],
  rose: ['#E78EA9'],
};

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  categories,
  initialSearch,
  onAddToCart,
  onSelectProduct,
}) => {
  const categoryList = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [pricePresetId, setPricePresetId] = useState<string>('all');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [isPending, startTransition] = useTransition();

  const priceBounds = useMemo(
    () => getPriceBounds(products.map((p) => p.price)),
    [products]
  );

  // Init from live bounds — starting at 0/0 filters out every product on SSR/first paint.
  const [rangeMin, setRangeMin] = useState(priceBounds.min);
  const [rangeMax, setRangeMax] = useState(priceBounds.max);

  const pricePresets = useMemo(() => buildPricePresets(priceBounds), [priceBounds]);

  useEffect(() => {
    setRangeMin(priceBounds.min);
    setRangeMax(priceBounds.max);
    setPricePresetId('all');
  }, [priceBounds.min, priceBounds.max]);

  const activeFilterCount = [
    selectedSize,
    selectedColor,
    availability !== 'all',
    pricePresetId !== 'all' ||
      rangeMin > priceBounds.min ||
      rangeMax < priceBounds.max,
  ].filter(Boolean).length;

  const filteredProducts = products.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchingHexes = COLOR_NAME_MAP[q] || [];
      const hasMatchingColor = p.colorway && p.colorway.some((c) => matchingHexes.includes(c));

      const matches =
        hasMatchingColor ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.yarnType && p.yarnType.toLowerCase().includes(q)) ||
        (p.tag && p.tag.toLowerCase().includes(q)) ||
        (p.dimensions && p.dimensions.toLowerCase().includes(q));
      if (!matches) return false;
    }

    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedColor && !p.colorway.includes(selectedColor)) return false;
    if (p.price < rangeMin || p.price > rangeMax) return false;
    if (availability === 'in_stock' && !isInStock(p)) return false;
    if (availability === 'pre_order' && isInStock(p)) return false;

    if (selectedSize) {
      const variants = p.sizeVariants;
      if (variants && variants.length > 0) {
        const match = variants.find((v) => v.size === selectedSize);
        if (!match || match.stock <= 0) return false;
      }
    }

    return true;
  });

  const clearFilters = () => {
    setSelectedSize(null);
    setSelectedColor(null);
    setPricePresetId('all');
    setRangeMin(priceBounds.min);
    setRangeMax(priceBounds.max);
    setAvailability('all');
  };

  const applyPreset = (id: string) => {
    const preset = pricePresets.find((p) => p.id === id);
    if (!preset) return;
    setPricePresetId(id);
    setRangeMin(preset.min);
    setRangeMax(preset.max);
  };

  const handleRangeMinChange = (value: number) => {
    const next = Math.min(value, rangeMax);
    setRangeMin(next);
    setPricePresetId('custom');
  };

  const handleRangeMaxChange = (value: number) => {
    const next = Math.max(value, rangeMin);
    setRangeMax(next);
    setPricePresetId('custom');
  };

  const handleCategoryChange = (catId: string) => {
    startTransition(() => {
      setSelectedCategory(catId);
    });
  };

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const rangeSpan = Math.max(priceBounds.max - priceBounds.min, 1);
  const minPct = ((rangeMin - priceBounds.min) / rangeSpan) * 100;
  const maxPct = ((rangeMax - priceBounds.min) / rangeSpan) * 100;

  return (
    <main className="relative min-h-screen py-10 sm:py-14 md:py-16 px-3 sm:px-4 md:px-8 lg:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 backdrop-blur-md px-4 sm:px-5 py-2 rounded-full border border-[#EFEBE4]">
            <span>Our Products</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2C302E] leading-[1.05] tracking-tight">
            Our <span className="italic font-normal text-[#B85D43]">Collection.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#2C302E]/70 leading-relaxed font-sans max-w-lg mx-auto font-medium">
            Handmade crochet cardigans, sweaters, dolls, and bags. Beautifully made from Ethiopian wool and fine cotton.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8 sm:mb-10 px-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#D4A373] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wool, doll, cardigan, color…"
              className="w-full bg-[#EFEBE4]/70 border border-[#EFEBE4] focus:border-[#B85D43]/40 rounded-full pl-11 pr-10 py-3 text-xs text-[#2C302E] placeholder-[#2C302E]/40 outline-none backdrop-blur-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-[#2C302E]/40 hover:text-[#2C302E] rounded-full"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2.5 text-center flex items-center justify-center gap-2 text-[11px] text-[#2C302E]/60">
              <span>
                Found <strong className="text-[#2C302E]">{filteredProducts.length}</strong> result
                {filteredProducts.length === 1 ? '' : 's'} for &ldquo;{searchQuery}&rdquo;
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#B85D43] font-semibold underline underline-offset-2 hover:opacity-80"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="relative mb-8 sm:mb-12 flex items-center justify-center max-w-5xl mx-auto group">
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-[#2C302E] hover:bg-[#FDFBF7] transition-all opacity-0 md:group-hover:opacity-100 -translate-x-4"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto py-2 px-2 sm:px-4 mx-0 sm:mx-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth w-full"
          >
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] backdrop-blur-lg shadow-sm shrink-0 min-w-max mx-auto">
              {categoryList.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex-shrink-0 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all duration-500 whitespace-nowrap snap-center ${
                      isActive
                        ? 'bg-[#B85D43] text-white shadow-sm'
                        : 'text-[#2C302E]/70 hover:text-[#2C302E] hover:bg-[#FDFBF7]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-[#2C302E] hover:bg-[#FDFBF7] transition-all opacity-0 md:group-hover:opacity-100 translate-x-4"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 lg:gap-12">
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <div className="lg:sticky lg:top-24 border border-[#E8E2D9] bg-[#FDFBF7]/90 backdrop-blur-md rounded-2xl lg:rounded-none overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#E8E2D9]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <SlidersHorizontal className="w-4 h-4 text-[#B85D43] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-serif text-xl leading-none text-[#2C302E]">Refine</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#2C302E]/45 mt-1">
                      {filteredProducts.length} of {products.length} pieces
                    </p>
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#B85D43] hover:underline shrink-0"
                  >
                    Reset ({activeFilterCount})
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#E8E2D9]">
                <section className="px-5 py-5">
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#2C302E]/55 mb-3">
                    Availability
                  </h4>
                  <div className="space-y-2">
                    {(
                      [
                        ['all', 'All items'],
                        ['in_stock', 'Ready to ship'],
                        ['pre_order', 'Pre-order'],
                      ] as const
                    ).map(([value, label]) => {
                      const active = availability === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setAvailability(value)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-semibold transition-colors border ${
                            active
                              ? 'border-[#2C302E] bg-[#2C302E] text-white'
                              : 'border-transparent bg-[#F3EFE8] text-[#2C302E]/75 hover:border-[#D4A373]/50'
                          }`}
                        >
                          <span>{label}</span>
                          {value === 'in_stock' && (
                            <span className={`text-[9px] uppercase tracking-wider ${active ? 'text-white/70' : 'text-[#2C302E]/40'}`}>
                              1–2 days
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="px-5 py-5">
                  <div className="flex items-baseline justify-between mb-3">
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#2C302E]/55">
                      Price (ETB)
                    </h4>
                    <span className="font-mono text-[10px] font-bold text-[#2C302E]/70">
                      {formatEtb(rangeMin)} – {formatEtb(rangeMax)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {pricePresets.map((preset) => {
                      const active = pricePresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyPreset(preset.id)}
                          className={`px-2.5 py-1.5 text-[10px] font-bold tracking-wide border transition-colors ${
                            active
                              ? 'border-[#B85D43] bg-[#B85D43]/10 text-[#B85D43]'
                              : 'border-[#E8E2D9] text-[#2C302E]/65 hover:border-[#D4A373]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative h-8 mb-2">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#E8E2D9]" />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-[#B85D43]"
                      style={{ left: `${minPct}%`, width: `${Math.max(maxPct - minPct, 0)}%` }}
                    />
                    <input
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step={Math.max(1, Math.round(rangeSpan / 100))}
                      value={rangeMin}
                      onChange={(e) => handleRangeMinChange(Number(e.target.value))}
                      className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2C302E] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#2C302E] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                      aria-label="Minimum price in ETB"
                    />
                    <input
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step={Math.max(1, Math.round(rangeSpan / 100))}
                      value={rangeMax}
                      onChange={(e) => handleRangeMaxChange(Number(e.target.value))}
                      className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#B85D43] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#B85D43] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                      aria-label="Maximum price in ETB"
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-[#2C302E]/40">
                    <span>{formatEtb(priceBounds.min)}</span>
                    <span>{formatEtb(priceBounds.max)}</span>
                  </div>
                </section>

                <section className="px-5 py-5">
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#2C302E]/55 mb-3">
                    Size
                  </h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SIZE_OPTIONS.map((size) => {
                      const active = selectedSize === size;
                      const short = size === 'Medium' ? 'M' : size === 'Large' ? 'L' : size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(active ? null : size)}
                          className={`h-10 text-[11px] font-bold border transition-colors ${
                            active
                              ? 'bg-[#2C302E] text-white border-[#2C302E]'
                              : 'border-[#E8E2D9] text-[#2C302E] hover:border-[#2C302E]/40'
                          }`}
                          aria-pressed={active}
                          title={size}
                        >
                          {short}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="px-5 py-5">
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#2C302E]/55 mb-3">
                    Color
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {['#D4A373', '#2C302E', '#FDFBF7', '#B85D43', '#52796F', '#E78EA9', '#A3B19B', '#C2B8A3'].map(
                      (color) => {
                        const active = selectedColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(active ? null : color)}
                            className={`w-7 h-7 rounded-full border transition-transform ${
                              active
                                ? 'ring-2 ring-offset-2 ring-[#B85D43] scale-110'
                                : 'border-black/10 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Filter by color ${color}`}
                            aria-pressed={active}
                          />
                        );
                      }
                    )}
                  </div>
                </section>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {filteredProducts.length > 0 ? (
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isPending ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                    onAddToCart={onAddToCart}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#E8E2D9]">
                <p className="font-serif text-2xl text-[#2C302E]">No items match these filters.</p>
                <p className="text-sm font-medium text-[#2C302E]/60 mt-2">
                  Try widening the price range or clearing size and color.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    clearFilters();
                    setSearchQuery('');
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#B85D43] text-white font-bold text-xs uppercase tracking-widest"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 sm:mt-28 py-8 sm:py-12 border-t border-[#EFEBE4] text-center space-y-2 px-2">
          <p className="font-serif text-xl sm:text-2xl text-[#2C302E]">
            Looking for a custom design or specific size?
          </p>
          <p className="text-xs text-[#2C302E]/60 uppercase tracking-widest font-mono font-medium">
            Handmade on demand in Addis Ababa • Prices in ETB
          </p>
        </div>
      </div>
    </main>
  );
};
