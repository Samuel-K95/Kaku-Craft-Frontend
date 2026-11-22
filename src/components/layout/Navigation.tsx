// ============================================================================
// components/layout/Navigation.tsx
// ============================================================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { SearchModal } from '@/components/ui/SearchModal';
import { NotificationMenu } from '@/components/layout/NotificationMenu';
import { PRODUCTS } from '@/data/products'; // Mock data for now
import { isAdminUser, isExpertUser } from '@/data/mockStore';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Navigation: React.FC<{ cartCount?: number }> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    items: cartItems,
    itemCount: cartCount,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
  } = useCart();
  const showAdminLink = isAdminUser(user);
  const showExpertLink = isExpertUser(user);

  const handleCloseMobile = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#EFEBE4] border-b border-[#EFEBE4] transition-all duration-300 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-16 sm:h-20 flex items-center justify-between">
          
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
                    className={`transition-colors py-2 border-b-2 font-bold ${
                      isActive 
                        ? 'border-[#2C302E] text-[#2C302E]' 
                        : 'border-transparent text-[#2C302E]/80 hover:text-[#2C302E]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {showAdminLink && (
                <Link
                  href="/admin"
                  className={`transition-colors py-2 border-b-2 font-bold ${
                    pathname.startsWith('/admin')
                      ? 'border-[#B85D43] text-[#B85D43]'
                      : 'border-transparent text-[#B85D43]/80 hover:text-[#B85D43]'
                  }`}
                >
                  Admin
                </Link>
              )}
              {showExpertLink && (
                <Link
                  href="/expert"
                  className={`transition-colors py-2 border-b-2 font-bold ${
                    pathname.startsWith('/expert')
                      ? 'border-[#52796F] text-[#52796F]'
                      : 'border-transparent text-[#52796F]/80 hover:text-[#52796F]'
                  }`}
                >
                  Expert
                </Link>
              )}
            </nav>
          </div>

          {/* Brand Crest */}
          <Link 
            href="/"
            className="cursor-pointer flex items-center space-x-2 sm:space-x-3 group"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FDFBF7] flex items-center justify-center border border-[#D4A373]/50 group-hover:scale-105 transition-transform duration-500 shadow-sm">
              <span className="font-serif font-black text-base sm:text-lg tracking-tighter text-[#1C4E4F]">ከኩ</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl tracking-[0.15em] font-bold text-[#2C302E] leading-none">
                KAKU
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] text-[#D4A373] uppercase font-bold">
                Craft • Studio
              </span>
            </div>
          </Link>

        {/* Right Utilities */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="text-[#2C302E]/80 hover:text-[#B85D43] transition-colors p-1"
            aria-label="Search Catalog"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/account"
                className="text-[#2C302E]/80 hover:text-[#2C302E] transition-colors font-medium text-xs tracking-widest uppercase flex items-center"
                aria-label="Account"
              >
                <User className="w-4 h-4 mr-1" />
                My Account
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-[#2C302E]/50 hover:text-[#B85D43] transition-colors font-bold text-[10px] tracking-widest uppercase"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/signin"
                className="text-[#2C302E]/80 hover:text-[#2C302E] transition-colors font-medium text-xs tracking-widest uppercase flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-full bg-[#2C302E] text-white text-[10px] tracking-widest uppercase font-bold hover:bg-[#B85D43] transition-colors"
              >
                Register
              </Link>
            </div>
          )}

            <NotificationMenu />

            <button 
              onClick={() => setIsCartOpen(true)}
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

            <div className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full border border-[#2C302E]/40 text-[#2C302E] text-[11px] font-bold tracking-tighter">
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
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link href="/account" onClick={handleCloseMobile}>
                        0{navLinks.length + 1}. My Account
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          handleCloseMobile();
                        }}
                        className="text-left"
                      >
                        0{navLinks.length + 2}. Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/signin" onClick={handleCloseMobile}>
                        0{navLinks.length + 1}. Sign In
                      </Link>
                    </li>
                    <li>
                      <Link href="/register" onClick={handleCloseMobile}>
                        0{navLinks.length + 2}. Register
                      </Link>
                    </li>
                  </>
                )}
                {showAdminLink && (
                  <li>
                    <Link
                      href="/admin"
                      onClick={handleCloseMobile}
                      className="text-[#B85D43]"
                    >
                      Admin
                    </Link>
                  </li>
                )}
                {showExpertLink && (
                  <li>
                    <Link
                      href="/expert"
                      onClick={handleCloseMobile}
                      className="text-[#52796F]"
                    >
                      Expert
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div className="pt-6 border-t border-[#EFEBE4] text-xs text-[#2C302E]/60 space-y-2 font-mono">
              <p>Handmade in Addis Ababa • Worldwide Shipping</p>
              <p>© {new Date().getFullYear()} KAKU CRAFT. All Rights Reserved.</p>
            </div>
          </div>
        )}
      </header>

      {/* Realtime Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Slide-out Cart */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
      />
    </>
  );
};