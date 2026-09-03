// ============================================================================
// 4. components/ui/ProductCard.tsx
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  onSelectProduct 
}) => {
  return (
    <div 
      className="group rounded-3xl bg-[#FDFBF7] border border-[#EFEBE4] hover:border-[#D4A373] p-4 transition-all duration-500 flex flex-col justify-between"
    >
      <div 
        onClick={() => onSelectProduct?.(product)} 
        className={onSelectProduct ? 'cursor-pointer' : ''}
      >
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#EFEBE4] mb-4">
          <Image 
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 bg-[#FDFBF7]/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#2C302E]">
            {product.handcraftedHours}h Handmade
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-serif text-lg text-[#2C302E] font-medium leading-snug">{product.name}</h3>
            <span className="font-mono text-sm font-semibold text-[#2C302E]">${product.price}</span>
          </div>
          <p className="text-xs text-[#2C302E]/60 line-clamp-2">{product.description}</p>
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-[#EFEBE4] flex items-center justify-between">
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
          onClick={() => onAddToCart(product)}
          className="px-4 py-2 rounded-full bg-[#2C302E] text-white text-[11px] uppercase tracking-wider hover:bg-[#D4A373] transition-colors"
        >
          Acquire
        </button>
      </div>
    </div>
  );
};