// ============================================================================
// 7. components/layout/Footer.tsx
// ============================================================================
'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2C302E]/90 text-[#FDFBF7] pt-20 pb-12 px-6 md:px-12 border-t border-[#2C302E]/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-black text-2xl text-[#D4A373]">ከኩ</span>
            <span className="font-serif text-xl tracking-widest">CRAFT</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed font-medium">
            Handmade crochet clothes and dolls, made with care loop by loop in Ethiopia.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4A373] mb-4">Our Shop</h4>
          <ul className="space-y-2 text-xs text-white/70 font-medium">
            <li><Link href="/shop" className="hover:text-white">Cardigans & Sweaters</Link></li>
            <li><Link href="/shop" className="hover:text-white">Crochet Dolls</Link></li>
            <li><Link href="/shop" className="hover:text-white">Handbags & Accessories</Link></li>
            <li><Link href="/about" className="hover:text-white">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4A373] mb-4">Customer Care</h4>
          <ul className="space-y-2 text-xs text-white/70 font-medium">
            <li><a href="#care" className="hover:text-white">Washing Guide</a></li>
            <li><a href="#mending" className="hover:text-white">Repairs</a></li>
            <li><a href="#shipping" className="hover:text-white">Worldwide Shipping</a></li>
            <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4A373]">Newsletter</h4>
          <p className="text-xs text-white/60 font-medium">Subscribe to know about new products and special offers.</p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex">
            <input 
              type="email" 
              required
              placeholder="email@example.com" 
              className="bg-white/10 text-xs px-4 py-2.5 rounded-l-full border-none focus:outline-none focus:ring-1 focus:ring-[#D4A373] w-full text-white"
            />
            <button type="submit" className="bg-[#D4A373] text-white px-5 rounded-r-full text-xs hover:bg-[#b58356] transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/40 font-mono">
        <p>© {new Date().getFullYear()} KAKU CRAFT ETHIOPIA. ALL RIGHTS RESERVED.</p>
        <p className="mt-2 sm:mt-0">HONORING TRADITIONAL ETHIOPIAN TEXTILE ARTISTRY</p>
      </div>
    </footer>
  );
};