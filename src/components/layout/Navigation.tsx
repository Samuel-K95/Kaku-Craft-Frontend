// ============================================================================
// components/layout/Navigation.tsx
// ============================================================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { PRODUCTS } from '@/data/products'; // Mock data for now

export const Navigation: React.FC<{ cartCount?: number }> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();

  // MOCK CART STATE
  const [cartItems, setCartItems] = useState([
    { product: PRODUCTS[0], quantity: 1 },
    { product: PRODUCTS[4], quantity: 2 }
  ]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const handleRemove = (id: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };

  const handleCloseMobile = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Atelier' },
    { path: '/shop', label: 'Collection' },
    { path: '/about', label: 'Heritage' },
    { path: '/contact', label: 'Bespoke & Contact' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#EFEBE4]/80 border-b border-[#EFEBE4] transition-all duration-300 select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          
          {/* Left Navigation */}
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-full hover:bg-[#FDFBF7]/80 transition-colors duration-200 md:hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6 text-[#2C302E]" />
            </button>

            <nav className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-medium">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link 
                    key={link.path}
                    href={link.path}
                    className={`transition-colors py-2 border-b-2 ${
                      isActive 
                        ? 'border-[#2C302E] text-[#2C302E] font-bold' 
                        : 'border-transparent text-[#2C302E]/65 hover:text-[#2C302E]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Brand Crest */}
          <Link 
            href="/"
            className="cursor-pointer flex items-center space-x-3 group"
          >
            <div className="relative w-10 h-10 rounded-full bg-[#FDFBF7] flex items-center justify-center border border-[#D4A373]/50 group-hover:scale-105 transition-transform duration-500 shadow-sm">
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
          </Link>

          {/* Right Utilities */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:block text-[#2C302E]/70 hover:text-[#2C302E] transition-colors p-2" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/account"
              className="hidden sm:block text-[#2C302E]/70 hover:text-[#2C302E] transition-colors p-2"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#FDFBF7] hover:bg-[#D4A373] hover:text-white transition-all duration-300 shadow-sm"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#2C302E] hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2C302E] text-white text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full border border-[#2C302E]/40 text-[#2C302E] text-[11px] font-bold tracking-tighter ml-2">
              ET
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-20 bg-[#EFEBE4]/95 backdrop-blur-md z-40 p-8 flex flex-col justify-between border-t border-[#EFEBE4]">
            <div className="space-y-6">
              <p className="text-xs font-bold tracking-widest text-[#D4A373] uppercase font-mono">Navigation</p>
              <ul className="space-y-4 font-serif text-2xl text-[#2C302E]">
                {navLinks.map((link, idx) => (
                  <li key={link.path}>
                    <Link href={link.path} onClick={handleCloseMobile}>
                      0{idx + 1}. {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/account" onClick={handleCloseMobile}>05. Client Portal</Link>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-[#EFEBE4] text-xs text-[#2C302E]/60 space-y-2 font-mono">
              <p>Handmade in Addis Ababa • Worldwide Shipping</p>
              <p>© {new Date().getFullYear()} KAKU CRAFT. All Rights Reserved.</p>
            </div>
          </div>
        )}
      </header>

      {/* Slide-out Cart */}
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />
    </>
  );
};