import React from 'react';
import Link from 'next/link';
import { getLiveProductByIdOrSlug } from '@/lib/products';
import { PRODUCTS } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getLiveProductByIdOrSlug(id);

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="font-serif text-3xl text-[#2C302E]">Item Not Found</h1>
        <Link
          href="/shop"
          className="text-xs uppercase tracking-widest font-bold text-[#B85D43] hover:underline"
        >
          Return to Collection
        </Link>
      </main>
    );
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
