'use client';

import React, { useState } from 'react';
import { PRODUCTS } from '@/data/products';
import Image from 'next/image';
import { ShieldCheck, UploadCloud, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);

  // Mock Cart Data for Checkout
  const cartItems = [
    { product: PRODUCTS[0], quantity: 1 },
    { product: PRODUCTS[4], quantity: 2 }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const depositRequired = subtotal * 0.5;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitProof = () => {
    setStep(3);
  };

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 select-none">
      
      {/* Left Column: Form Flow */}
      <div className="flex-1 space-y-8">
        
        {/* Progress Tracker */}
        <div className="flex items-center space-x-4 text-xs font-mono tracking-widest uppercase text-[#2C302E]/40 mb-12">
          <span className={step >= 1 ? 'text-[#D4A373] font-bold' : ''}>01. Shipping</span>
          <span className="w-8 h-px bg-[#2C302E]/20" />
          <span className={step >= 2 ? 'text-[#D4A373] font-bold' : ''}>02. Deposit Proof</span>
          <span className="w-8 h-px bg-[#2C302E]/20" />
          <span className={step === 3 ? 'text-[#D4A373] font-bold' : ''}>03. Confirmed</span>
        </div>

        {/* STEP 1: Shipping Details */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="bg-[#EFEBE4]/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/20 shadow-sm space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="font-serif text-4xl text-[#2C302E] mb-2">Shipping Details</h1>
              <p className="text-sm text-[#2C302E]/60">Where should we deliver your handcrafted artifacts?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">First Name</label>
                <input required type="text" className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors" placeholder="Yodit" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">Last Name</label>
                <input required type="text" className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors" placeholder="Alemu" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">Email Address</label>
                <input required type="email" className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors" placeholder="yodit@example.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">Shipping Address</label>
                <textarea required rows={3} className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors" placeholder="Street, City, Postal Code" />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#2C302E] text-white rounded-full py-4 font-bold text-sm tracking-widest uppercase hover:bg-[#1a1c1b] transition-colors">
              Continue to Payment
            </button>
          </form>
        )}

        {/* STEP 2: Payment Proof */}
        {step === 2 && (
          <div className="bg-[#EFEBE4]/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/20 shadow-sm space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div>
              <h1 className="font-serif text-4xl text-[#2C302E] mb-2">Secure Deposit</h1>
              <p className="text-sm text-[#2C302E]/60">
                To begin production, a 50% deposit is required. Please transfer <strong className="text-[#B85D43]">${depositRequired.toFixed(2)}</strong> to our account and upload the receipt.
              </p>
            </div>

            <div className="bg-white/60 rounded-2xl p-6 border border-[#2C302E]/10 space-y-4">
              <h3 className="font-serif text-xl">Bank Transfer Details</h3>
              <div className="space-y-2 text-sm font-mono text-[#2C302E]/80">
                <p>Bank: <span className="text-[#2C302E] font-bold">Commercial Bank of Ethiopia</span></p>
                <p>Account Name: <span className="text-[#2C302E] font-bold">Kaku Craft Studio</span></p>
                <p>Account Number: <span className="text-[#2C302E] font-bold">100028394857</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">Upload Payment Proof (Image)</label>
              
              <div className="relative border-2 border-dashed border-[#2C302E]/20 rounded-2xl p-8 hover:bg-white/50 hover:border-[#D4A373] transition-colors group cursor-pointer text-center flex flex-col items-center justify-center">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                
                {file ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="font-mono text-sm text-[#2C302E]">{file.name}</p>
                    <p className="text-xs text-[#2C302E]/50">Click to replace</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#EFEBE4] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5 text-[#2C302E]/60" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2C302E]">Click to upload or drag and drop</p>
                      <p className="text-xs text-[#2C302E]/50 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleSubmitProof} 
              disabled={!file}
              className="w-full bg-[#B85D43] text-white rounded-full py-4 font-bold text-sm tracking-widest uppercase hover:bg-[#9c4d37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Deposit Proof
            </button>
            <button 
              onClick={() => setStep(1)} 
              className="w-full text-center text-xs font-bold uppercase tracking-widest text-[#2C302E]/50 hover:text-[#2C302E] transition-colors"
            >
              Back to Shipping
            </button>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div className="bg-[#EFEBE4]/80 backdrop-blur-md p-12 rounded-3xl border border-white/20 shadow-sm text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h1 className="font-serif text-4xl text-[#2C302E] mb-4">Order Received</h1>
              <p className="text-[#2C302E]/70 max-w-md mx-auto leading-relaxed">
                Your payment proof is currently under review by our artisans. You will receive an email once production begins.
              </p>
            </div>
            
            <div className="bg-white/50 rounded-2xl p-6 inline-block text-left border border-[#2C302E]/10">
              <p className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/40 mb-1">Order Number</p>
              <p className="font-mono text-xl">#ORD-KAKU-9284</p>
            </div>

            <div className="pt-4">
              <Link href="/account" className="inline-block bg-[#2C302E] text-white rounded-full px-8 py-4 font-bold text-sm tracking-widest uppercase hover:bg-[#1a1c1b] transition-colors">
                View in Client Portal
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Right Column: Order Summary (Sticky) */}
      <div className="lg:w-[400px]">
        <div className="sticky top-32 bg-white/70 backdrop-blur-md rounded-3xl border border-[#EFEBE4] p-8 shadow-sm">
          <h3 className="font-serif text-2xl text-[#2C302E] mb-6 border-b border-[#2C302E]/10 pb-4">Order Summary</h3>
          
          <div className="space-y-6 mb-8">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="relative w-16 h-20 bg-[#EFEBE4] rounded-md overflow-hidden shrink-0">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-[#2C302E] leading-tight mb-1">{item.product.name}</h4>
                  <p className="text-xs text-[#2C302E]/60 font-mono mb-2">QTY: {item.quantity}</p>
                  <p className="font-mono font-bold text-sm">${item.product.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 font-mono text-sm text-[#2C302E] border-t border-[#2C302E]/10 pt-6">
            <div className="flex justify-between">
              <span className="text-[#2C302E]/60">Total Value</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>50% Deposit Due Now</span>
              <span className="text-[#B85D43]">${depositRequired.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 bg-[#EFEBE4]/50 p-4 rounded-xl flex gap-3 items-start border border-[#EFEBE4]">
            <Info className="w-5 h-5 text-[#B85D43] shrink-0 mt-0.5" />
            <p className="text-xs text-[#2C302E]/70 leading-relaxed">
              The remaining 50% (${(subtotal - depositRequired).toFixed(2)}) will be requested prior to shipping.
            </p>
          </div>
        </div>
      </div>

    </main>
  );
}