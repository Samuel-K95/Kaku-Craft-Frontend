// ============================================================================
// app/page.tsx
// ============================================================================
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { LandingView } from '@/components/views/LandingView';

export default function KakuCraftApp() {
  const router = useRouter();

  return (
    <LandingView 
      products={PRODUCTS}
      onExploreClick={() => router.push('/shop')}
      onSelectProduct={(p) => router.push(`/shop/${p.id}`)}
      onBespokeClick={() => router.push('/contact')}
    />
  );
}