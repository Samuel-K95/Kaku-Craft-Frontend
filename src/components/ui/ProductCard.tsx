// ============================================================================
// components/ui/ProductCard.tsx
// ============================================================================
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  index?: number;
}

// Gentle, organic sculptural contours matching the landing page lookbook
const SILHOUETTE_MASKS = [
  'rounded-t-[100px] rounded-b-[28px]',
  'rounded-[80px_28px_80px_28px]',
  'rounded-full',
  'rounded-b-[100px] rounded-t-[28px]',
  'rounded-[28px_80px_28px_80px]',
  'rounded-t-[80px] rounded-b-[40px]',
];

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  onSelectProduct,
  index = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const maskClass = SILHOUETTE_MASKS[index % SILHOUETTE_MASKS.length];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
      className="group cursor-pointer flex flex-col justify-between p-6 rounded-[36px] bg-[#FDFBF7] border border-[#EFEBE4] hover:border-[#D4A373] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_25px_50px_rgba(212,163,115,0.14)] select-none"
    >
      <div>
        {/* Top Header Tag & Hours */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] uppercase font-bold tracking-[0.25em] px-3 py-1 rounded-full bg-[#EFEBE4] text-[#B85D43]">
            {product.tag}
          </span>
          <span className="text-[10px] font-mono text-[#2C302E]/60 uppercase tracking-widest font-medium">
            {product.handcraftedHours}h Crafted
          </span>
        </div>

        {/* Sculptural Organic Window */}
        <div 
          className={`relative aspect-[3/3.8] w-full ${maskClass} overflow-hidden bg-[#EFEBE4] border-2 border-[#EFEBE4] group-hover:border-[#D4A373]/80 transition-all duration-700 shadow-inner`}
        >
          {/* Subtle Warm Fiber Tint */}
          <div className="absolute inset-0 bg-[#D4A373]/10 mix-blend-multiply pointer-events-none z-10" />

          <Image 
            src={isHovered ? product.hoverImage : product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />

          {/* Warm Bottom Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C302E]/65 via-transparent to-transparent pointer-events-none z-10" />

          {/* Quick-Inspect Minimalist Badge */}
          <div 
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FDFBF7]/90 text-[#2C302E] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4 text-[#B85D43]" />
          </div>

          {/* Dimensions / Model Overlay */}
          {product.dimensions && (
            <div className="absolute bottom-4 left-4 right-4 text-white z-20 text-center">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4A373] bg-[#2C302E]/70 backdrop-blur-md px-3 py-1 rounded-full">
                {product.dimensions}
              </span>
            </div>
          )}
        </div>

        {/* Artifact Metadata */}
        <div className="mt-5 space-y-1.5 text-left">
          <div className="flex justify-between items-baseline gap-2">
            <h3 className="font-serif text-xl text-[#2C302E] font-medium leading-snug group-hover:text-[#B85D43] transition-colors">
              {product.name}
            </h3>
            <span className="font-mono text-base font-semibold text-[#2C302E]">
              ${product.price}
            </span>
          </div>
          <p className="text-xs text-[#2C302E]/65 line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Details: Palette & Action */}
      <div className="pt-4 mt-4 border-t border-[#EFEBE4] flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          {product.colorway.map((color, i) => (
            <span 
              key={i} 
              className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner" 
              style={{ backgroundColor: color }} 
            />
          ))}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="px-5 py-2 rounded-full bg-[#EFEBE4] hover:bg-[#D4A373] text-[#2C302E] hover:text-white text-[11px] uppercase tracking-wider font-semibold transition-all duration-300"
        >
          Acquire
        </button>
      </div>
    </div>
  );
};