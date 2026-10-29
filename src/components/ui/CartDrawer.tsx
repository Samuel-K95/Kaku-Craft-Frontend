'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import Link from 'next/link';
import {
  availabilityLabel,
  cartFulfillmentNote,
  deliveryLabel,
  isInStock,
} from '@/lib/stock';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  // The signature Kaku Craft 50% deposit rule
  const depositRequired = subtotal * 0.5;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#2C302E]/20 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#FDFBF7] shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EFEBE4]">
          <h2 className="font-serif text-2xl text-[#2C302E] font-medium">Your Cart</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#EFEBE4] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#2C302E]" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#2C302E]/60">
              <ShieldCheck className="w-12 h-12 stroke-[1px]" />
              <p className="font-serif text-xl font-medium">Your cart is empty.</p>
              <p className="text-sm font-medium">Discover our handmade products.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 group">
                <div className="relative w-24 h-32 bg-[#EFEBE4] rounded-lg overflow-hidden shrink-0">
                  <Image 
                    src={item.product.image} 
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg leading-tight pr-4 text-[#2C302E]">
                        {item.product.name}
                      </h3>
                      <button 
                        onClick={() => onRemove(item.product.id)}
                        className="text-[#2C302E]/40 hover:text-[#B85D43] transition-colors mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#2C302E]/60 mt-1 uppercase tracking-wider font-mono">
                      {item.product.category}
                    </p>
                    <p
                      className={`text-[10px] uppercase tracking-widest font-bold mt-2 ${
                        isInStock(item.product) ? 'text-[#52796F]' : 'text-[#B85D43]'
                      }`}
                    >
                      {availabilityLabel(item.product)} · {deliveryLabel(item.product)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-[#EFEBE4] rounded-full bg-white">
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-2 text-[#2C302E]/60 hover:text-[#2C302E]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-[#2C302E]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-2 text-[#2C302E]/60 hover:text-[#2C302E]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-mono font-bold text-[#2C302E]">
                      ${item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-[#EFEBE4]/50 border-t border-[#EFEBE4] space-y-6">
            <div className="space-y-3 font-mono text-sm text-[#2C302E] font-medium">
              <div className="flex justify-between">
                <span className="text-[#2C302E]/80 font-bold">Total</span>
                <span className="font-bold">${subtotal}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-[#2C302E]/10 pt-3">
                <span>50% Deposit Due Now</span>
                <span className="text-[#B85D43]">${depositRequired.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-[#2C302E]/60 font-medium leading-relaxed text-center mt-2">
                {cartFulfillmentNote(items)}
              </p>
            </div>

            <Link 
              href="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-between bg-[#2C302E] text-white px-6 py-4 rounded-full hover:bg-[#1a1c1b] transition-colors group shadow-md"
            >
              <span className="font-bold text-sm tracking-widest uppercase">Go to Checkout</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}