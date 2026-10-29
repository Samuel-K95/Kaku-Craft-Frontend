// ============================================================================
// components/landing/NewArrivals.tsx
// ============================================================================
'use client';

import React from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';

interface NewArrivalsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ 
  products,
  onSelectProduct,
  onAddToCart
}) => {
  // Just grabbing a few latest items to simulate "New Arrivals"
  const newProducts = products.slice(0, 4);

  return (
    <section className="relative w-full max-w-7xl mx-auto py-20 px-4 md:px-12 border-t border-[#EFEBE4]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 space-y-4 md:space-y-0">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4A373] font-mono">
            Fresh from the Studio
          </span>
          <h2 className="font-serif text-4xl text-[#2C302E]">New Items.</h2>
        </div>
        <p className="text-sm font-medium text-[#2C302E]/70 max-w-xs md:text-right">
          The latest additions to our handmade collection, crafted just for you.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {newProducts.map((product, idx) => (
          <ProductCard 
            key={product.id}
            product={product}
            index={idx}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};