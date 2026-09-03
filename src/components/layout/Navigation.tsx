// ============================================================================
// 6. components/layout/Navigation.tsx
// ============================================================================
import React, { useState } from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { PageView } from '@/types';

interface NavigationProps {
  currentPage: PageView;
  onPageChange: (page: PageView) => void;
  cartCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  onPageChange, 
  cartCount 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (page: PageView) => {
    onPageChange(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-[#EFEBE4] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* Left Navigation */}
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 rounded-full hover:bg-[#EFEBE4] transition-colors duration-200 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6 text-[#2C302E]" />
          </button>

          <nav className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-medium">
            {(['landing', 'shop', 'about', 'contact'] as PageView[]).map((pageKey) => {
              const labels: Record<PageView, string> = {
                landing: 'Atelier',
                shop: 'Collection',
                about: 'Heritage',
                contact: 'Bespoke & Contact'
              };

              return (
                <button 
                  key={pageKey}
                  onClick={() => handleNavigate(pageKey)} 
                  className={`transition-colors py-2 border-b-2 ${
                    currentPage === pageKey 
                      ? 'border-[#2C302E] text-[#2C302E]' 
                      : 'border-transparent text-[#2C302E]/60 hover:text-[#2C302E]'
                  }`}
                >
                  {labels[pageKey]}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Brand Crest */}
        <div 
          onClick={() => handleNavigate('landing')}
          className="cursor-pointer flex items-center space-x-3 group"
        >
          <div className="relative w-10 h-10 rounded-full bg-[#EFEBE4] flex items-center justify-center border border-[#D4A373]/40 group-hover:scale-105 transition-transform duration-500">
            <span className="font-serif font-black text-lg tracking-tighter text-[#1C4E4F]">ከኩ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-[0.15em] font-bold text-[#2C302E] leading-none">
              KAKU
            </span>
            <span className="font-sans text-[9px] tracking-[0.35em] text-[#D4A373] uppercase font-bold">
              Craft • Studio
            </span>
          </div>
        </div>

        {/* Right Utilities */}
        <div className="flex items-center space-x-6">
          <button className="hidden sm:block text-[#2C302E]/70 hover:text-[#2C302E] transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleNavigate('shop')} 
            className="relative p-2.5 rounded-full bg-[#EFEBE4] hover:bg-[#D4A373] hover:text-white transition-all duration-300"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2C302E] text-white text-[10px] flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>
          <div className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full border border-[#2C302E] text-[11px] font-bold tracking-tighter">
            ET
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-[#FDFBF7] z-40 p-8 flex flex-col justify-between border-t border-[#EFEBE4]">
          <div className="space-y-6">
            <p className="text-xs font-bold tracking-widest text-[#D4A373] uppercase">Navigation</p>
            <ul className="space-y-4 font-serif text-2xl">
              <li><button onClick={() => handleNavigate('landing')}>01. Editorial Home</button></li>
              <li><button onClick={() => handleNavigate('shop')}>02. The Shop & Archive</button></li>
              <li><button onClick={() => handleNavigate('about')}>03. Craft Heritage</button></li>
              <li><button onClick={() => handleNavigate('contact')}>04. Bespoke Inquiries</button></li>
            </ul>
          </div>
          <div className="pt-6 border-t border-[#EFEBE4] text-xs text-[#2C302E]/60 space-y-2">
            <p>Handmade in Addis Ababa • Worldwide Shipping</p>
            <p>© {new Date().getFullYear()} KAKU CRAFT. All Rights Reserved.</p>
          </div>
        </div>
      )}
    </header>
  );
};