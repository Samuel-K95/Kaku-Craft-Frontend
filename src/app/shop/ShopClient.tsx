'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { ApiCategory } from '@/types/products';
import { ShopView } from '@/components/views/ShopView';
import { useCategoriesQuery, useProductsQuery } from '@/lib/products';
import { useCart } from '@/context/CartContext';

interface ShopClientProps {
  initialProducts: Product[];
  initialCategories: ApiCategory[];
}

export default function ShopClient({ initialProducts, initialCategories }: ShopClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const { data: products } = useProductsQuery(undefined, initialProducts);
  const { data: categoriesData } = useCategoriesQuery(initialCategories);

  const categories = React.useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      const list = [{ id: 'all', label: 'All Items' }];
      categoriesData.forEach((c) => {
        list.push({ id: c.slug, label: c.name });
      });
      return list;
    }
    return undefined;
  }, [categoriesData]);

  const handleAddToCart = (product: Product) => {
    void addToCart(product, 1);
  };

  return (
    <ShopView
      products={products || initialProducts}
      categories={categories}
      onAddToCart={handleAddToCart}
      onSelectProduct={(p) => router.push(`/shop/${p.id}`)}
    />
  );
}

