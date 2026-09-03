// ============================================================================
// components/views/LandingView.tsx
// ============================================================================
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveLineup } from '@/components/landing/InteractiveLineup';
import { CraftPillars } from '@/components/landing/CraftPillars';
import { Product } from '@/types';
import { StudioBespokeCTA } from '../landing/StudioBespokeCTA';

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
  return (
    <main className="relative">
      <HeroSection onExploreClick={onExploreClick} />
      <InteractiveLineup products={products} onSelectProduct={onSelectProduct} />
      <CraftPillars />
      <StudioBespokeCTA onBespokeClick={onBespokeClick} />
    </main>
  );
};