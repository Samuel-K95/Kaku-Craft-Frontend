// ============================================================================
// app/page.tsx
// ============================================================================
'use client';

import React, { useState } from 'react';
import { PageView, Product } from '@/types';
import { PRODUCTS } from '@/data/products';
import { FloatingYarnThreads } from '@/components/ui/FloatingYarnThreads';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { QuickViewModal } from '@/components/ui/QuickViewModal';
import { LandingView } from '@/components/views/LandingView';
import { ShopView } from '@/components/views/ShopView';
import { AboutView } from '@/components/views/AboutView';
import { ContactView } from '@/components/views/ContactView';

export default function KakuCraftApp() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [cartCount, setCartCount] = useState<number>(2);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleAddToCart = (_product: Product) => {
    setCartCount(prev => prev + 1);
  };

  return (
    // Crucial: No `overflow-x-hidden` on this outer container to ensure CSS sticky pinning works!
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C302E] font-sans antialiased selection:bg-[#D4A373] selection:text-white relative">
      {/* Ambient Left & Right Threads */}
      <FloatingYarnThreads side="left" color="#A3B19B" />
      <FloatingYarnThreads side="right" color="#D4A373" />

      {/* Global Navigation */}
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        cartCount={cartCount} 
      />

      {/* View Switcher */}
      {currentPage === 'landing' && (
        <LandingView 
          products={PRODUCTS}
          onExploreClick={() => setCurrentPage('shop')}
          onSelectProduct={setQuickViewProduct}
          onBespokeClick={() => setCurrentPage('contact')}
        />
      )}

      {currentPage === 'shop' && (
        <ShopView 
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onSelectProduct={setQuickViewProduct}
        />
      )}

      {currentPage === 'about' && <AboutView />}

      {currentPage === 'contact' && <ContactView />}

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        onAddToCart={handleAddToCart} 
      />

      {/* Global Footer */}
      <Footer onPageChange={setCurrentPage} />
    </div>
  );
}