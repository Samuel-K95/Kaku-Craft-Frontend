// ============================================================================
// components/views/ShopView.tsx
// ============================================================================
'use client';

import React, { useState, useTransition } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';

interface ShopViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const CATEGORIES: { id: string; label: string }[] = [
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

export const ShopView: React.FC<ShopViewProps> = ({ 
  products, 
  onAddToCart, 
  onSelectProduct 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [isPending, startTransition] = useTransition();

  const filteredProducts = products.filter(p => {
    // 1. Category Filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    
    // 2. Color Filter (Mock: check if colorway includes selected color)
    if (selectedColor && !p.colorway.includes(selectedColor)) return false;

    // 3. Price Filter
    if (priceRange === 'under-50' && p.price >= 50) return false;
    if (priceRange === '50-150' && (p.price < 50 || p.price > 150)) return false;
    if (priceRange === 'over-150' && p.price <= 150) return false;

    // (Size filter would go here if our mock data had sizes array, 
    // for now we'll visually select it but not filter the data out completely)

    return true;
  });

  const handleCategoryChange = (catId: string) => {
    startTransition(() => {
      setSelectedCategory(catId);
    });
  };

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    // Shop Page Glass Layering - Using w-full and px-4 lg:px-8 for maximum width usage
    <main className="relative min-h-screen py-16 px-4 md:px-8 lg:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
      <div className="w-full max-w-[100vw] mx-auto relative z-10">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 backdrop-blur-md px-5 py-2 rounded-full border border-[#EFEBE4]">
            <span>Our Products</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2C302E] leading-none tracking-tight">
            Our <span className="italic font-normal text-[#B85D43]">Collection.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#2C302E]/70 leading-relaxed font-sans max-w-lg mx-auto font-medium">
            Handmade crochet cardigans, sweaters, dolls, and bags. Beautifully made from Ethiopian wool and fine cotton.
          </p>
        </div>

        {/* Scrollable Category Filter Bar with Centered Container and Buttons */}
        <div className="relative mb-12 flex items-center justify-center max-w-5xl mx-auto group">
          
          {/* Scroll Left Button */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#2C302E] hover:bg-[#FDFBF7] transition-all opacity-0 md:group-hover:opacity-100 -translate-x-4"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto py-2 px-4 mx-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            <div className="inline-flex items-center space-x-2 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] backdrop-blur-lg shadow-sm shrink-0 min-w-max mx-auto">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex-shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all duration-500 whitespace-nowrap snap-center ${
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
          
          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

          {/* Scroll Right Button */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#2C302E] hover:bg-[#FDFBF7] transition-all opacity-0 md:group-hover:opacity-100 translate-x-4"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Layout: Sidebar Filters + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-[#EFEBE4]/40 p-5 rounded-[24px] border border-[#EFEBE4] backdrop-blur-sm sticky top-24">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-serif text-2xl text-[#2C302E]">Filters</h3>
                 <button 
                   onClick={() => {
                     setSelectedSize(null);
                     setSelectedColor(null);
                     setPriceRange('all');
                   }}
                   className="text-[10px] uppercase font-bold tracking-wider text-[#B85D43] hover:underline"
                 >
                   Clear All
                 </button>
               </div>

               <div className="space-y-8">
                 {/* Size */}
                 <div>
                   <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#2C302E]/70 mb-3">Size</h4>
                   <div className="flex flex-wrap gap-2">
                     {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                       <button 
                         key={size}
                         onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                         className={`w-9 h-9 rounded-full border text-xs font-bold transition-colors ${
                           selectedSize === size 
                             ? 'bg-[#2C302E] text-white border-[#2C302E]' 
                             : 'border-[#2C302E]/20 text-[#2C302E] hover:bg-[#2C302E]/5'
                         }`}
                       >
                         {size}
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 {/* Color */}
                 <div>
                   <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#2C302E]/70 mb-3">Color</h4>
                   <div className="flex flex-wrap gap-3">
                     {['#D4A373', '#2C302E', '#FDFBF7', '#B85D43', '#52796F', '#E78EA9', '#A3B19B', '#C2B8A3'].map(color => (
                       <button 
                         key={color} 
                         onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                         className={`w-7 h-7 rounded-full border transition-all ${
                           selectedColor === color 
                             ? 'ring-2 ring-offset-2 ring-[#B85D43] scale-110' 
                             : 'border-black/10 hover:scale-110'
                         }`}
                         style={{ backgroundColor: color }} 
                         aria-label={`Filter by color ${color}`}
                       />
                     ))}
                   </div>
                 </div>

                 {/* Price */}
                 <div>
                   <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-[#2C302E]/70 mb-3">Price Range</h4>
                   <div className="space-y-3 text-sm font-bold text-[#2C302E]">
                     <label className="flex items-center space-x-3 cursor-pointer group">
                       <input 
                         type="radio" 
                         name="price" 
                         value="all"
                         checked={priceRange === 'all'}
                         onChange={(e) => setPriceRange(e.target.value)}
                         className="w-4 h-4 accent-[#B85D43] bg-white border-gray-300 focus:ring-[#B85D43]" 
                       />
                       <span className="group-hover:text-[#B85D43] transition-colors">All Prices</span>
                     </label>
                     <label className="flex items-center space-x-3 cursor-pointer group">
                       <input 
                         type="radio" 
                         name="price" 
                         value="under-50"
                         checked={priceRange === 'under-50'}
                         onChange={(e) => setPriceRange(e.target.value)}
                         className="w-4 h-4 accent-[#B85D43] bg-white border-gray-300 focus:ring-[#B85D43]" 
                       />
                       <span className="group-hover:text-[#B85D43] transition-colors">Under $50</span>
                     </label>
                     <label className="flex items-center space-x-3 cursor-pointer group">
                       <input 
                         type="radio" 
                         name="price" 
                         value="50-150"
                         checked={priceRange === '50-150'}
                         onChange={(e) => setPriceRange(e.target.value)}
                         className="w-4 h-4 accent-[#B85D43] bg-white border-gray-300 focus:ring-[#B85D43]" 
                       />
                       <span className="group-hover:text-[#B85D43] transition-colors">$50 - $150</span>
                     </label>
                     <label className="flex items-center space-x-3 cursor-pointer group">
                       <input 
                         type="radio" 
                         name="price" 
                         value="over-150"
                         checked={priceRange === 'over-150'}
                         onChange={(e) => setPriceRange(e.target.value)}
                         className="w-4 h-4 accent-[#B85D43] bg-white border-gray-300 focus:ring-[#B85D43]" 
                       />
                       <span className="group-hover:text-[#B85D43] transition-colors">Over $150</span>
                     </label>
                   </div>
                 </div>
               </div>
            </div>
          </aside>

          {/* Product Grid - Using more columns so items are smaller, maxed out at 4 columns */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div 
                className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="font-serif text-2xl text-[#2C302E]">No items found.</p>
                <p className="text-sm font-medium text-[#2C302E]/60 mt-2">Try adjusting your filters.</p>
                <button 
                   onClick={() => {
                     setSelectedCategory('all');
                     setSelectedSize(null);
                     setSelectedColor(null);
                     setPriceRange('all');
                   }}
                   className="mt-6 px-6 py-2 rounded-full bg-[#B85D43] text-white font-bold text-xs uppercase tracking-widest"
                 >
                   Clear Filters
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Minimalist Footer Note */}
        <div className="mt-28 py-12 border-t border-[#EFEBE4] text-center space-y-2">
          <p className="font-serif text-2xl text-[#2C302E]">
            Looking for a custom design or specific size?
          </p>
          <p className="text-xs text-[#2C302E]/60 uppercase tracking-widest font-mono font-medium">
            Handmade on demand in Addis Ababa • Worldwide Shipping
          </p>
        </div>
      </div>
    </main>
  );
};