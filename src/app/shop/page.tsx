'use client';

import React, { useState } from 'react';
import { PRODUCTS } from '@/data/products';
import { ShopView } from '@/components/views/ShopView';
import { QuickViewModal } from '@/components/ui/QuickViewModal';
import { Product } from '@/types';

export default function ShopPage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleAddToCart = (_product: Product) => {
    // We will connect this to a global cart store soon
    alert(`Added ${_product.name} to cart`);
  };

  return (
    <>
      <ShopView 
        products={PRODUCTS}
        onAddToCart={handleAddToCart}
        onSelectProduct={setQuickViewProduct}
      />
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        onAddToCart={handleAddToCart} 
      />
    </>
  );
}