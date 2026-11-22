'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingView } from '@/components/views/LandingView';
import { useProductsQuery } from '@/lib/products';

export default function KakuCraftApp() {
  const router = useRouter();
  const { data: products = [] } = useProductsQuery();

  return (
    <LandingView
      products={products}
      onExploreClick={() => router.push('/shop')}
      onSelectProduct={(p) => router.push(`/shop/${p.id}`)}
      onBespokeClick={() => router.push('/contact')}
    />
  );
}
