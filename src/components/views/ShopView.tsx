// ============================================================================
// components/views/ShopView.tsx
// ============================================================================
'use client';

import React, { useState, useTransition } from 'react';
import { Sparkles } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';

interface ShopViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Artifacts' },
  { id: 'cardigans', label: 'Cardigans' },
  { id: 'sweaters', label: 'Sweaters' },
  { id: 'handbags', label: 'Handbags' },
  { id: 'beanies', label: 'Beanies' },
  { id: 'small-dolls', label: 'Small Dolls' },
  { id: 'keychain-dolls', label: 'Keychain Dolls' },
];

export const ShopView: React.FC<ShopViewProps> = ({ 
  products, 
  onAddToCart, 
  onSelectProduct 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [isPending, startTransition] = useTransition();

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleCategoryChange = (catId: ProductCategory) => {
    startTransition(() => {
      setSelectedCategory(catId);
    });
  };

  return (
    // Shop Page Glass Layering
    <main className="relative min-h-screen py-16 px-4 md:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 backdrop-blur-sm px-5 py-2 rounded-full border border-[#EFEBE4]">
            <span>The Permanent Collection</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#2C302E] leading-none tracking-tight">
            The Fiber <span className="italic font-normal text-[#B85D43]">Archive.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#2C302E]/70 leading-relaxed font-sans max-w-lg mx-auto">
            A visual lookbook of handcrafted silhouettes. Every loop is woven by an artisan from Ethiopian highland wool and fine cotton filaments.
          </p>
        </div>

        {/* Frosted Category Filter Bar */}
        <div className="flex items-center justify-center mb-16 overflow-x-auto pb-4 no-scrollbar">
          <div className="inline-flex items-center space-x-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] backdrop-blur-lg shadow-sm">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-500 whitespace-nowrap ${
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

        {/* Lookbook Product Gallery */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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

        {/* Minimalist Footer Note */}
        <div className="mt-28 py-12 border-t border-[#EFEBE4] text-center space-y-2">
          <p className="font-serif text-2xl text-[#2C302E]">
            Seeking a bespoke colorway or made-to-measure sizing?
          </p>
          <p className="text-xs text-[#2C302E]/60 uppercase tracking-widest font-mono">
            Handcrafted on demand in Addis Ababa • Worldwide Express Dispatch
          </p>
        </div>
      </div>
    </main>
  );
};