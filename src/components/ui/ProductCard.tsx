// ============================================================================
// components/ui/ProductCard.tsx
// ============================================================================
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '@/types';
import {
  availabilityLabel,
  cartCtaLabel,
  deliveryLabel,
  isInStock,
} from '@/lib/stock';
import { formatEtb } from '@/lib/money';
import { WishlistButton } from '@/components/shop/WishlistButton';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  onSelectProduct,
  index = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Consistent elegant arched window shape for all products
  const maskClass = 'rounded-t-[80px] rounded-b-[24px]';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
      className="group cursor-pointer flex flex-col justify-between p-4 sm:p-5 rounded-[36px] bg-[#FDFBF7] border border-[#EFEBE4] hover:border-[#D4A373] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_25px_50px_rgba(212,163,115,0.14)] select-none h-full"
    >
      <div>
        {/* Availability + craft time */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
              isInStock(product)
                ? 'bg-[#52796F]/15 text-[#52796F]'
                : 'bg-[#B85D43]/10 text-[#B85D43]'
            }`}
          >
            {availabilityLabel(product)}
          </span>
          <span className="text-[10px] font-mono text-[#2C302E]/60 uppercase tracking-widest font-medium">
            {deliveryLabel(product)}
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

          <div className="absolute top-4 left-4 z-20">
            <WishlistButton productId={product.id} className="w-8 h-8" />
          </div>

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
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-serif text-lg leading-tight text-[#2C302E] font-bold group-hover:text-[#B85D43] transition-colors line-clamp-2 flex-1">
              {product.name}
            </h3>
            <span className="font-mono text-sm font-bold text-[#2C302E] mt-0.5 whitespace-nowrap">
              {formatEtb(product.price)}
            </span>
          </div>
          <p className="text-[11px] text-[#2C302E]/70 line-clamp-2 leading-relaxed font-medium">
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
          className="px-4 py-2 rounded-full bg-[#EFEBE4] hover:bg-[#D4A373] text-[#2C302E] hover:text-white text-[10px] uppercase tracking-widest font-bold transition-all duration-300"
        >
          {cartCtaLabel(product)}
        </button>
      </div>
    </div>
  );
};