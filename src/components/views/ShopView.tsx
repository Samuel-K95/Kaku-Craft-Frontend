// ============================================================================
// 12. components/views/ShopView.tsx
// ============================================================================
import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';

interface ShopViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const CATEGORIES: ProductCategory[] = ['all', 'wearables', 'dolls', 'accessories', 'home'];

export const ShopView: React.FC<ShopViewProps> = ({ 
  products, 
  onAddToCart, 
  onSelectProduct 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <main className="py-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="border-b border-[#EFEBE4] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4A373]">Permanent Collection</p>
          <h1 className="font-serif text-4xl md:text-6xl text-[#2C302E] mt-2">The Fiber Archive</h1>
        </div>
        <p className="text-xs md:text-sm text-[#2C302E]/60 max-w-xs mt-4 md:mt-0 font-mono">
          Displaying {filteredProducts.length} certified bespoke artifacts
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[#EFEBE4]">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#2C302E] text-white shadow-sm' 
                  : 'bg-[#EFEBE4]/70 hover:bg-[#EFEBE4] text-[#2C302E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-xs uppercase font-medium tracking-wider text-[#2C302E]/70">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Sort: Featured Works</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </main>
  );
};