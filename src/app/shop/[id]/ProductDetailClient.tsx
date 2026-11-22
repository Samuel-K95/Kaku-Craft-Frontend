'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, Clock, Ruler, Scale, Scissors, ShoppingBag, Star, PlayCircle, CheckCircle2 } from 'lucide-react';
import {
  availabilityLabel,
  cartCtaLabel,
  deliveryLabel,
  isInStock,
} from '@/lib/stock';
import { formatEtb } from '@/lib/money';
import { WishlistButton } from '@/components/shop/WishlistButton';
import { ProductReviews } from '@/components/shop/ProductReviews';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = (p: Product) => {
    void addToCart(p, 1);
  };

  return (
    <main className="relative py-24 px-4 md:px-12 bg-transparent text-[#2C302E] select-none min-h-screen">
      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Breadcrumb / Back Navigation */}
        <button 
          onClick={() => router.push('/shop')}
          className="flex items-center space-x-2 text-[#2C302E]/60 hover:text-[#2C302E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] font-mono">Back to Collection</span>
        </button>

        {/* TOP SECTION: Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative w-full aspect-[4/5] bg-[#EFEBE4] rounded-[2rem] overflow-hidden group">
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-[#2C302E] text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold">
                {product.tag}
              </div>
              <div className="absolute top-4 right-4 z-20">
                <WishlistButton productId={product.id} className="w-10 h-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative w-full aspect-square bg-[#EFEBE4] rounded-2xl overflow-hidden">
                <Image src={product.hoverImage} alt={`${product.name} alternate view`} fill className="object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="relative w-full aspect-square bg-[#EFEBE4]/50 rounded-2xl overflow-hidden flex items-center justify-center border border-[#2C302E]/10">
                <p className="font-serif text-sm text-[#2C302E]/50">More Views Coming</p>
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-10 lg:pt-8 animate-in fade-in slide-in-from-right-8 duration-700">
            
            {/* Header */}
            <div className="space-y-4 border-b border-[#2C302E]/10 pb-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4A373] font-mono">
                  {product.category.replace('-', ' ')}
                </span>
                <div className="flex items-center space-x-1 text-[#2C302E]/70">
                  <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
                  <span className="text-xs font-bold">{product.rating}</span>
                  <span className="text-[10px]">({product.reviewsCount})</span>
                </div>
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5xl text-[#2C302E] leading-tight">
                {product.name}
              </h1>
              
              <p className="font-mono text-2xl text-[#2C302E] font-bold">
                {formatEtb(product.price)}
              </p>
              
              <p className="text-sm text-[#2C302E]/80 leading-relaxed max-w-md font-medium">
                {product.description}
              </p>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-[#2C302E]/60">Available Colors</h3>
              <div className="flex items-center space-x-3">
                {product.colorway.map((hex, i) => (
                  <button 
                    key={i} 
                    className="w-8 h-8 rounded-full border border-black/10 hover:scale-110 transition-transform shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#D4A373] outline-none"
                    style={{ backgroundColor: hex }}
                    aria-label={`Select color ${hex}`}
                  />
                ))}
              </div>
            </div>

            {/* Availability */}
            <div
              className={`rounded-2xl border px-4 py-3 ${
                isInStock(product)
                  ? 'bg-[#52796F]/10 border-[#52796F]/20'
                  : 'bg-[#B85D43]/10 border-[#B85D43]/20'
              }`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-widest ${
                  isInStock(product) ? 'text-[#52796F]' : 'text-[#B85D43]'
                }`}
              >
                {availabilityLabel(product)} · {deliveryLabel(product)}
              </p>
              <p className="text-[11px] font-medium text-[#2C302E]/70 mt-1">
                {isInStock(product)
                  ? 'This item is ready. After your 50% deposit is verified, we can deliver in 1–2 days. Pay the rest on delivery.'
                  : `This item is out of stock. You can pre-order it. After your 50% deposit is verified, making takes about ${product.productionDays} days. Pay the rest on delivery.`}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-full bg-[#2C302E] text-white py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#1a1c1b] transition-colors flex items-center justify-center space-x-3 shadow-lg shadow-black/10"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cartCtaLabel(product)}</span>
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest text-[#2C302E]/50 font-bold">
                <CheckCircle2 className="w-3 h-3 text-[#52796F]" />
                <span>50% Deposit Required at Checkout</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-[#EFEBE4]/50 p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
                <Scissors className="w-4 h-4 text-[#D4A373] mb-2" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mb-1">Material</p>
                <p className="text-xs font-bold text-[#2C302E]">{product.yarnType}</p>
              </div>
              <div className="bg-[#EFEBE4]/50 p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
                <Clock className="w-4 h-4 text-[#D4A373] mb-2" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mb-1">
                  {isInStock(product) ? 'Delivery' : 'Make Time'}
                </p>
                <p className="text-xs font-bold text-[#2C302E]">{deliveryLabel(product)}</p>
              </div>
              {product.dimensions && (
                <div className="bg-[#EFEBE4]/50 p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
                  <Ruler className="w-4 h-4 text-[#D4A373] mb-2" />
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mb-1">Dimensions</p>
                  <p className="text-xs font-medium text-[#2C302E]">{product.dimensions}</p>
                </div>
              )}
              {product.weightGrams && (
                <div className="bg-[#EFEBE4]/50 p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
                  <Scale className="w-4 h-4 text-[#D4A373] mb-2" />
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mb-1">Weight</p>
                  <p className="text-xs font-medium text-[#2C302E]">{product.weightGrams}g</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: TikTok / Social Proof Mock */}
        <div className="py-16 border-y border-[#2C302E]/10 my-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-[#2C302E]">See It In Motion.</h2>
              <p className="text-sm text-[#2C302E]/70 max-w-md leading-relaxed font-medium">
                Watch how we make this item in our Addis Ababa studio. From sourcing the wool to the final stitch.
              </p>
              <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#B85D43] hover:text-[#2C302E] transition-colors">
                <PlayCircle className="w-5 h-5" />
                <span>Watch on TikTok</span>
              </button>
            </div>
            <div className="relative w-full aspect-[16/9] md:aspect-video bg-[#EFEBE4] rounded-3xl overflow-hidden group cursor-pointer border border-[#2C302E]/5 shadow-sm">
              <Image src={product.image} alt="Video Thumbnail" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-[#2C302E]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} />

        {/* BOTTOM SECTION: Related Items */}
        {relatedProducts.length > 0 && (
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="font-serif text-3xl text-[#2C302E]">Related Items</h2>
              <p className="text-xs font-mono tracking-widest uppercase text-[#2C302E]/50 mt-2 font-bold">Explore the Collection</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p, idx) => (
                <ProductCard 
                  key={p.id}
                  product={p}
                  index={idx}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={(selected) => router.push(`/shop/${selected.id}`)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

