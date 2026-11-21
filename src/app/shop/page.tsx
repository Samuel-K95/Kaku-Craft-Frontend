import React from 'react';
import { getLiveCategories, getLiveProducts } from '@/lib/products';
import ShopClient from './ShopClient';

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; category?: string }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const search = resolved?.search || '';
  const category = resolved?.category || 'all';

  const [initialProducts, initialCategories] = await Promise.all([
    getLiveProducts({ search, category }),
    getLiveCategories(),
  ]);

  return (
    <ShopClient
      initialProducts={initialProducts}
      initialCategories={initialCategories}
      initialSearch={search}
    />
  );
}
