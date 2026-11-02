'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle, Info, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api, normalizeError } from '@/lib/api';
import { ApiOrder, ApiPaymentProof } from '@/types/orders';
import {
  availabilityLabel,
  cartFulfillmentNote,
  cartMaxWaitDays,
  deliveryLabel,
  isInStock,
} from '@/lib/stock';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, totalPrice, depositRequired, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdOrder, setCreatedOrder] = useState<ApiOrder | null>(null);

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = totalPrice;
  const { maxDays, hasPreOrder } = cartMaxWaitDays(cartItems);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Please sign in or create an account to place and track your order.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const order = await api.post<ApiOrder>('/orders/', {
        shipping_address: `${fullName} — ${address}`,
        notes: notes ? `${notes} (Contact: ${email})` : `Contact: ${email}`,
      });
      setCreatedOrder(order);
      setStep(2);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitProof = async () => {
    if (!createdOrder) {
      setError('No order found. Please return to shipping details.');
      return;
    }
    if (!file) {
      setError('Please select an image file of your payment receipt.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('amount', depositRequired.toFixed(2));
      formData.append('kind', 'deposit');
      if (transactionRef.trim()) {
        formData.append('note', `Ref: ${transactionRef.trim()}`);
      }

      await api.upload<ApiPaymentProof>(`/orders/${createdOrder.id}/payment-proofs/`, formData);

      clearCart();
      setStep(3);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 px-4 select-none">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2C302E]">Your Cart is Empty</h1>
        <p className="text-sm text-[#2C302E]/60 max-w-sm">
          Select handcrafted items from our collection before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="mt-4 bg-[#2C302E] text-white px-8 py-3.5 rounded-full font-serif text-xs uppercase tracking-widest hover:bg-[#B85D43] transition-colors"
        >
          Explore Collection
        </Link>
      </main>
    );
  }

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

        {error && (
          <div className="rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-5 py-3.5 text-xs font-medium text-[#B85D43]">
            {error}
          </div>
        )}

        {/* STEP 1: Shipping Details */}
        {step === 1 && (
          <form
            onSubmit={handleCreateOrder}
            className="bg-[#EFEBE4]/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/20 shadow-sm space-y-8 animate-in fade-in duration-500"
          >
            <div>
              <h1 className="font-serif text-4xl text-[#2C302E] mb-2">Shipping Details</h1>
              <p className="text-sm text-[#2C302E]/60 font-medium">
                Where should we send your order? Timing depends on in-stock vs pre-order items.
              </p>
            </div>

            {!isAuthenticated && (
              <div className="p-4 rounded-2xl bg-[#D4A373]/15 border border-[#D4A373]/30 flex items-center justify-between text-xs">
                <span className="text-[#2C302E] font-medium">Already have an account?</span>
                <Link
                  href="/signin"
                  className="font-bold uppercase tracking-wider text-[#B85D43] hover:underline"
                >
                  Sign In
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                  placeholder="e.g. Sara Tekle"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                  placeholder="sara@example.com"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">
                  Shipping Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                  placeholder="Street, District, City, Country"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">
                  Delivery Notes / Phone
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                  placeholder="+251 91 123 4567, apartment gate code, etc."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2C302E] text-white rounded-full py-4 font-bold text-sm tracking-widest uppercase hover:bg-[#1a1c1b] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Order...' : 'Continue to Payment (50% Deposit)'}
            </button>
          </form>
        )}

        {/* STEP 2: Payment Proof */}
        {step === 2 && (
          <div className="bg-[#EFEBE4]/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/20 shadow-sm space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div>
              <h1 className="font-serif text-4xl text-[#2C302E] mb-2">Secure Deposit</h1>
              <p className="text-sm text-[#2C302E]/60 font-medium">
                Pay a 50% deposit now (
                <strong className="text-[#B85D43]">${depositRequired.toFixed(2)}</strong>
                ). After we verify it, in-stock items ship in 1–2 days
                {hasPreOrder ? `; pre-order items start making and take up to about ${maxDays} days` : ''}
                . The remaining 50% is paid on delivery.
              </p>
            </div>

            <div className="bg-white/60 rounded-2xl p-6 border border-[#2C302E]/10 space-y-4">
              <h3 className="font-serif text-xl">Bank Transfer Details</h3>
              <div className="space-y-2 text-sm font-mono text-[#2C302E]/80">
                <p>
                  Bank: <span className="text-[#2C302E] font-bold">Commercial Bank of Ethiopia</span>
                </p>
                <p>
                  Account Name: <span className="text-[#2C302E] font-bold">Kaku Craft Studio</span>
                </p>
                <p>
                  Account Number: <span className="text-[#2C302E] font-bold">100028394857</span>
                </p>
                <p>
                  Order Ref:{' '}
                  <span className="text-[#B85D43] font-bold">#{createdOrder?.id}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">
                Transaction Reference Number (Optional)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. FT263849102"
                className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">
                Upload Payment Proof (Screenshot / Receipt Image)
              </label>

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
              disabled={!file || loading}
              className="w-full bg-[#B85D43] text-white rounded-full py-4 font-bold text-sm tracking-widest uppercase hover:bg-[#9c4d37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Receipt...' : 'Submit Deposit Proof'}
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
              <p className="text-[#2C302E]/70 max-w-md mx-auto leading-relaxed font-medium">
                Your deposit proof is under review by our Addis Ababa studio. Once verified,
                in-stock items ship in 1–2 days
                {hasPreOrder ? `, and pre-order pieces will be made (about ${maxDays} days)` : ''}
                . The remaining balance (${(subtotal - depositRequired).toFixed(2)}) is paid upon delivery.
              </p>
            </div>

            <div className="bg-white/50 rounded-2xl p-6 inline-block text-left border border-[#2C302E]/10">
              <p className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/40 mb-1">
                Order Number
              </p>
              <p className="font-mono text-xl text-[#B85D43] font-bold">
                #ORD-KAKU-{createdOrder?.id || '9284'}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/account"
                className="inline-block bg-[#2C302E] text-white rounded-full px-8 py-4 font-bold text-sm tracking-widest uppercase hover:bg-[#1a1c1b] transition-colors"
              >
                View in Client Portal
              </Link>
              <Link
                href="/shop"
                className="inline-block bg-transparent text-[#2C302E] border border-[#2C302E]/20 rounded-full px-8 py-4 font-bold text-sm tracking-widest uppercase hover:bg-white/50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Order Summary (Sticky) */}
      <div className="lg:w-[400px]">
        <div className="sticky top-32 bg-white/70 backdrop-blur-md rounded-3xl border border-[#EFEBE4] p-8 shadow-sm">
          <h3 className="font-serif text-2xl text-[#2C302E] mb-6 border-b border-[#2C302E]/10 pb-4">
            Order Summary
          </h3>

          <div className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="relative w-16 h-20 bg-[#EFEBE4] rounded-md overflow-hidden shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-[#2C302E] leading-tight mb-1">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-[#2C302E]/60 font-mono mb-1">QTY: {item.quantity}</p>
                  <p
                    className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${
                      isInStock(item.product) ? 'text-[#52796F]' : 'text-[#B85D43]'
                    }`}
                  >
                    {availabilityLabel(item.product)} · {deliveryLabel(item.product)}
                  </p>
                  <p className="font-mono font-bold text-sm">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
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
            <p className="text-xs text-[#2C302E]/70 leading-relaxed font-medium">
              {cartFulfillmentNote(cartItems)} Remaining 50% ($
              {(subtotal - depositRequired).toFixed(2)}) is paid on delivery.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
