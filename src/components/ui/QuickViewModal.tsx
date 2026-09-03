// ============================================================================
// 5. components/ui/QuickViewModal.tsx
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Product } from '@/types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ 
  product, 
  onClose, 
  onAddToCart 
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2C302E]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] w-full max-w-3xl rounded-3xl p-6 md:p-8 border border-[#EFEBE4] relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full bg-[#EFEBE4] hover:bg-[#D4A373] hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#EFEBE4]">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover" 
            />
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4A373]">{product.tag}</span>
            <h3 className="font-serif text-3xl text-[#2C302E]">{product.name}</h3>
            <p className="font-mono text-xl font-bold text-[#2C302E]">${product.price}</p>
            <p className="text-xs text-[#2C302E]/70 leading-relaxed">{product.description}</p>
            
            <div className="space-y-1.5 pt-2 border-t border-[#EFEBE4] text-xs">
              <p><strong className="font-medium text-[#2C302E]">Yarn Composition:</strong> {product.yarnType}</p>
              <p><strong className="font-medium text-[#2C302E]">Handcraft Duration:</strong> {product.handcraftedHours} Dedicated Hours</p>
            </div>

            <div className="pt-4 flex space-x-3">
              <button 
                onClick={() => { 
                  onAddToCart(product); 
                  onClose(); 
                }}
                className="flex-1 py-3.5 rounded-full bg-[#2C302E] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#D4A373] transition-colors"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};