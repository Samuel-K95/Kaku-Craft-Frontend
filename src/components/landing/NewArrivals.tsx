'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { ADMIN_CMS } from '@/data/admin/seed';
import { api } from '@/lib/api';
import { ApiSiteContent } from '@/types/cms';

interface NewArrivalsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const { data: contents } = useQuery({
    queryKey: ['cms-content'],
    queryFn: () => api.get<ApiSiteContent[]>('/cms/content/', { requiresAuth: false }),
    staleTime: 60 * 1000,
  });

  const ids = useMemo(() => {
    const arrivals =
      contents?.find((c) => c.key === 'new-arrivals') ||
      contents?.find((c) => c.section === 'new_arrivals');
    const banner = contents?.find((c) => c.key === 'special-occasion-banner');
    const fromArrivals = (arrivals?.data?.newArrivalProductIds as string[] | undefined) || [];
    const fromBanner = (banner?.data?.newArrivalProductIds as string[] | undefined) || [];
    if (fromArrivals.length) return fromArrivals.map(String);
    if (fromBanner.length) return fromBanner.map(String);
    return ADMIN_CMS.newArrivalProductIds.map(String);
  }, [contents]);

  const selected = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const newProducts = selected.length > 0 ? selected : products.slice(0, 4);

  return (
    <section className="relative w-full max-w-7xl mx-auto py-12 sm:py-16 md:py-20 px-4 md:px-12 border-t border-[#EFEBE4]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 space-y-3 md:space-y-0 gap-2">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4A373] font-mono">
            Fresh from the Studio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C302E]">New Items.</h2>
        </div>
        <p className="text-sm font-medium text-[#2C302E]/70 max-w-xs md:text-right">
          The latest additions to our handmade collection, crafted just for you.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {newProducts.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            index={idx}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};
