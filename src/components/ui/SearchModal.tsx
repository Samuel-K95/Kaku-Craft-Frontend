'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Product } from '@/types';
import { PRODUCTS } from '@/data/products';
import { getLiveProducts } from '@/lib/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SUGGESTIONS = [
  'Cardigans',
  'Mohair Wool',
  'Amigurumi Dolls',
  'Beanies & Hats',
  'Handbags',
  'Sweaters',
  'Keychains',
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced search across both live backend and local products
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        // Query live API with search keyword
        const liveItems = await getLiveProducts({ search: trimmed });
        
        // Also search static mock catalog for full offline fallback
        const lower = trimmed.toLowerCase();
        const localMatches = PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.description.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower) ||
            p.yarnType.toLowerCase().includes(lower) ||
            p.tag.toLowerCase().includes(lower)
        );

        // Merge and deduplicate by ID or name
        const seen = new Set<string>();
        const merged: Product[] = [];
        for (const item of [...liveItems, ...localMatches]) {
          const key = item.id || item.name;
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(item);
          }
        }

        setResults(merged);
      } catch {
        // Fallback to local filter on network error
        const lower = trimmed.toLowerCase();
        const localMatches = PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.description.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower)
        );
        setResults(localMatches);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  // Keyboard navigation (ESC to close, Enter to view full shop search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectProduct = (product: Product) => {
    onClose();
    router.push(`/shop/${product.id}`);
  };

  const handleViewAllInShop = () => {
    if (!query.trim()) return;
    onClose();
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleViewAllInShop();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FDFBF7] rounded-[32px] border border-[#EFEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
      >
        {/* Search Header Form */}
        <form
          onSubmit={handleFormSubmit}
          className="relative flex items-center px-6 py-5 border-b border-[#2C302E]/10 bg-[#EFEBE4]/60"
        >
          <Search className="w-5 h-5 text-[#D4A373] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cardigans, dolls, beanies, yarn..."
            className="w-full bg-transparent font-serif text-lg sm:text-xl text-[#2C302E] placeholder-[#2C302E]/40 outline-none"
          />

          {loading && (
            <Loader2 className="w-5 h-5 text-[#B85D43] animate-spin shrink-0 mx-2" />
          )}

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 text-[#2C302E]/40 hover:text-[#2C302E] rounded-full hover:bg-black/5 transition-colors mr-2"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60 hover:text-[#B85D43] px-3 py-1.5 rounded-full border border-[#2C302E]/10 hover:border-[#B85D43]/30 transition-colors"
          >
            ESC
          </button>
        </form>

        {/* Search Body Results / Suggestions */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!query.trim() && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#2C302E]/60">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="text-xs font-medium bg-[#EFEBE4]/70 hover:bg-[#B85D43] text-[#2C302E] hover:text-white px-4 py-2 rounded-full border border-[#2C302E]/10 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim().length >= 2 && !loading && results.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="font-serif text-lg text-[#2C302E]">
                No handcrafted pieces found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#2C302E]/60 max-w-sm mx-auto">
                Try searching by broader terms like <span className="italic font-serif">wool, cardigans, dolls, bags,</span> or check our full collection.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#2C302E]/50 mb-2">
                Found {results.length} piece{results.length > 1 ? 's' : ''}
              </div>
              <div className="divide-y divide-[#2C302E]/5">
                {results.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#EFEBE4]/60 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#EFEBE4] shrink-0 border border-[#2C302E]/10">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-sm font-semibold text-[#2C302E] group-hover:text-[#B85D43] transition-colors truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[#2C302E]/60 mt-0.5">
                          <span className="capitalize">{product.category.replace('-', ' ')}</span>
                          <span>•</span>
                          <span className="truncate">{product.yarnType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      <span className="font-serif text-sm font-bold text-[#2C302E]">
                        ${product.price}
                      </span>
                      <div className="text-[10px] text-[#B85D43] font-semibold flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
                        View <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {query.trim().length >= 2 && results.length > 0 && (
          <div className="p-4 bg-[#EFEBE4]/70 border-t border-[#2C302E]/10 flex items-center justify-between">
            <span className="text-xs text-[#2C302E]/60">
              Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-[#2C302E]/20">Enter</kbd> to see all results
            </span>
            <button
              type="button"
              onClick={handleViewAllInShop}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B85D43] hover:underline hover:opacity-90"
            >
              View in Shop Catalog
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
