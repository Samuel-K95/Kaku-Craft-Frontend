// ============================================================================
// components/views/LandingView.tsx
// ============================================================================
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveLineup } from '@/components/landing/InteractiveLineup';
import { CraftPillars } from '@/components/landing/CraftPillars';
import { Product } from '@/types';
import { StudioBespokeCTA } from '../landing/StudioBespokeCTA';
import { SpecialOccasions } from '@/components/landing/SpecialOccasions';
import { NewArrivals } from '@/components/landing/NewArrivals';

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
  onBespokeClick
}) => {
  const handleAddToCart = (product: Product) => {
    alert(`Added ${product.name} to cart`);
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