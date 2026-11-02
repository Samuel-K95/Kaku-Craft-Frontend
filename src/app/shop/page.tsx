import React from 'react';
import { getLiveCategories, getLiveProducts } from '@/lib/products';
import ShopClient from './ShopClient';

export default async function ShopPage() {
  const [initialProducts, initialCategories] = await Promise.all([
    getLiveProducts(),
    getLiveCategories(),
  ]);

  return (
    <ShopClient
      initialProducts={initialProducts}
      initialCategories={initialCategories}
    />
  );
}
