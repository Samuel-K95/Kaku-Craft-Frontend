'use client';

import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveLineup } from '@/components/landing/InteractiveLineup';
import { Product } from '@/types';
import { StudioBespokeCTA } from '../landing/StudioBespokeCTA';
import { SpecialOccasions } from '@/components/landing/SpecialOccasions';
import { NewArrivals } from '@/components/landing/NewArrivals';
import { TikTokSpotlight } from '@/components/landing/TikTokSpotlight';
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
      {/* <SpecialOccasions /> */}
      <InteractiveLineup products={products} onSelectProduct={onSelectProduct} />
      <TikTokSpotlight />
      <NewArrivals
        products={products}
        onSelectProduct={onSelectProduct}
        onAddToCart={handleAddToCart}
      />
      <StudioBespokeCTA products={products} onBespokeClick={onBespokeClick} />
    </main>
  );
};
