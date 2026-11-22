'use client';

import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveLineup } from '@/components/landing/InteractiveLineup';
import { CraftPillars } from '@/components/landing/CraftPillars';
import { Product } from '@/types';
import { StudioBespokeCTA } from '../landing/StudioBespokeCTA';
import { SpecialOccasions } from '@/components/landing/SpecialOccasions';
import { NewArrivals } from '@/components/landing/NewArrivals';
import { useCart } from '@/context/CartContext';

interface LandingViewProps {
  products: Product[];
  onExploreClick: () => void;
  onSelectProduct: (product: Product) => void;
  onBespokeClick: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  products,
  onExploreClick,
  onSelectProduct,
  onBespokeClick,
}) => {
  const { addToCart, openCart } = useCart();

  const handleAddToCart = async (product: Product) => {
    await addToCart(product, 1);
    openCart();
  };

  return (
    <main className="relative">
      <HeroSection onExploreClick={onExploreClick} />
      <SpecialOccasions />
      <InteractiveLineup products={products} onSelectProduct={onSelectProduct} />
      <NewArrivals
        products={products}
        onSelectProduct={onSelectProduct}
        onAddToCart={handleAddToCart}
      />
      <CraftPillars />
      <StudioBespokeCTA onBespokeClick={onBespokeClick} />
    </main>
  );
};
