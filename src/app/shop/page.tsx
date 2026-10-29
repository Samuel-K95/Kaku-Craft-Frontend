'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { ShopView } from '@/components/views/ShopView';
import { Product } from '@/types';

export default function ShopPage() {
  const router = useRouter();

  const handleAddToCart = (_product: Product) => {
    alert(`Added ${_product.name} to cart`);
  };

  return (
    <ShopView 
      products={PRODUCTS}
      onAddToCart={handleAddToCart}
      onSelectProduct={(p) => router.push(`/shop/${p.id}`)}
    />
  );
}