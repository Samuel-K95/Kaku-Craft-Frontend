// ============================================================================
// components/views/ContactView.tsx
// ============================================================================
'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Send, CheckCircle2, Mail, MapPin, Clock, UploadCloud, X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, normalizeError } from '@/lib/api';
import { ApiCustomOrder } from '@/types/orders';

const PRODUCT_TYPES = [
  'Cardigan',
  'Sweater',
  'Bag',
  'Beanie or Hat',
  'Doll',
  'Keychain Doll',
  'Other',
];

const MAX_INSPIRATION_IMAGES = 4;

interface InspirationPreview {
  id: string;
  file: File;
  url: string;
}

export const ContactView: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Cardigan');
  const [notes, setNotes] = useState('');

  const [inspirationImages, setInspirationImages] = useState<InspirationPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrder, setCreatedOrder] = useState<ApiCustomOrder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearInspirationImages = () => {
    setInspirationImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.url));
      return [];
    });
  };

  const handleInspirationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setInspirationImages((prev) => {
      const remaining = MAX_INSPIRATION_IMAGES - prev.length;
      const nextFiles = files.slice(0, remaining).map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...nextFiles];
    });

    // Allow re-selecting the same file later
    e.target.value = '';
  };

  const removeInspirationImage = (id: string) => {
    setInspirationImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!notes.trim()) {
      setErrorMsg('Please provide details or specifications for your request.');
      return;
    }

    if (!isAuthenticated) {
      setErrorMsg('Please sign in or create an account to submit a custom order request.');
      return;
    }

    setIsSubmitting(true);

    try {
      const description = `[Category: ${category}] Contact: ${fullName} (${email})\n\nDetails: ${notes.trim()}`;
      const primaryImage = inspirationImages[0]?.file;

      let res: ApiCustomOrder;
      if (primaryImage) {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('reference_image', primaryImage);
        res = await api.upload<ApiCustomOrder>('/orders/custom/', formData);
      } else {
        res = await api.post<ApiCustomOrder>('/orders/custom/', { description });
      }

      setCreatedOrder(res);
      setFullName('');
      setEmail('');
      setCategory('Cardigan');
      setNotes('');
      clearInspirationImages();
    } catch (err: unknown) {
      setErrorMsg(normalizeError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative py-16 px-4 md:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* --- EDITORIAL HEADER --- */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 backdrop-blur-md px-5 py-2 rounded-full border border-[#EFEBE4]">
            <span>Contact Us</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2C302E] leading-none tracking-tight">
            Get in <span className="italic font-normal text-[#B85D43]">Touch.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#2C302E]/70 leading-relaxed font-sans max-w-lg mx-auto font-medium">
            Have a custom color, specific size, or special doll in mind? Send your ideas to our Addis Ababa studio.
          </p>
        </div>

        {/* --- TWO-COLUMN COMMISSION WORKSPACE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Atelier Coordinates & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4A373] font-mono">
                Direct Contact
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C302E] font-medium leading-tight">
                Made for you, <br />
                <span className="italic text-[#B85D43]">stitch by stitch.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#2C302E]/75 font-sans leading-relaxed font-medium">
                Every custom order is made by a single person. We will help you choose colors, match yarn, and send you updates as we make it.
              </p>
            </div>

            {/* Info Badges */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#EFEBE4]/80 backdrop-blur-md border border-[#EFEBE4] flex items-center space-x-3 text-xs text-[#2C302E]/80 font-mono font-medium">
                <MapPin className="w-4 h-4 text-[#B85D43] shrink-0" />
                <span>Location: Addis Ababa, Ethiopia</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#EFEBE4]/80 backdrop-blur-md border border-[#EFEBE4] flex items-center space-x-3 text-xs text-[#2C302E]/80 font-mono font-medium">
                <Clock className="w-4 h-4 text-[#52796F] shrink-0" />
                <span>Custom Time: 2–3 Weeks</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#EFEBE4]/80 backdrop-blur-md border border-[#EFEBE4] flex items-center space-x-3 text-xs text-[#2C302E]/80 font-mono font-medium">
                <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>Response Time: Within 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Commission Form */}
          <div className="lg:col-span-7">
            <form 
              onSubmit={handleSubmit} 
              className="p-8 sm:p-10 rounded-[32px] bg-[#EFEBE4]/90 backdrop-blur-md border border-[#EFEBE4] space-y-6"
            >
              {createdOrder ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#52796F]/10 text-[#52796F] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-3xl text-[#2C302E]">
                    Request Submitted!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2C302E]/70 max-w-md mx-auto font-medium">
                    Your bespoke commission request (#{createdOrder.id}) has been sent directly to the studio. You can track progress and accept your artisan quote in your account portal.
                  </p>
                  <div className="pt-4 flex items-center justify-center gap-4">
                    <Link
                      href="/account"
                      className="inline-flex px-6 py-3 rounded-full bg-[#B85D43] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#A04D35] transition-colors"
                    >
                      View in My Account →
                    </Link>
                    <button
                      type="button"
                      onClick={() => setCreatedOrder(null)}
                      className="inline-flex px-6 py-3 rounded-full bg-white/80 border border-[#EFEBE4] text-[#2C302E] text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl text-[#2C302E]">Custom Request</h3>
                    <p className="text-xs text-[#2C302E]/60 font-medium">
                      Fill out the form below to begin your bespoke order.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {!isAuthenticated && (
                    <div className="p-4 rounded-2xl bg-[#D4A373]/10 border border-[#D4A373]/30 text-xs text-[#2C302E] flex items-center justify-between gap-3">
                      <span>Please sign in to link your custom commission to your account.</span>
                      <Link
                        href="/signin"
                        className="font-bold text-[#B85D43] underline shrink-0 hover:text-[#A04D35]"
                      >
                        Sign In →
                      </Link>
                    </div>
                  )}

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C302E]/70 font-mono">
                        Your Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sara Tekle" 
                        className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-xs text-[#2C302E] placeholder-[#2C302E]/40 focus:outline-none focus:border-[#B85D43] transition-colors font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C302E]/70 font-mono">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sara@example.com" 
                        className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-xs text-[#2C302E] placeholder-[#2C302E]/40 focus:outline-none focus:border-[#B85D43] transition-colors font-medium"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C302E]/70 font-mono">
                      Item Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-xs text-[#2C302E] focus:outline-none focus:border-[#B85D43] transition-colors font-medium cursor-pointer"
                    >
                      {PRODUCT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Design Notes */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C302E]/70 font-mono">
                      Design Notes & Colors
                    </label>
                    <textarea 
                      rows={4}
                      required
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe colors, measurements, yarn preferences, or specific styling details..."
                      className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-xs text-[#2C302E] placeholder-[#2C302E]/40 focus:outline-none focus:border-[#B85D43] transition-colors resize-none font-medium leading-relaxed"
                    />
                  </div>

                  {/* Photo Inspiration Upload */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C302E]/70 font-mono block">
                      Inspiration Reference Photo
                    </label>
                    <p className="text-[11px] text-[#2C302E]/60 font-medium">
                      Upload pictures of styles, colors, or items you like. This helps us understand what you want.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleInspirationUpload}
                    />

                    {inspirationImages.length < MAX_INSPIRATION_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full rounded-2xl border border-dashed border-[#D4A373]/50 bg-[#FDFBF7] px-4 py-8 flex flex-col items-center justify-center gap-2 hover:border-[#B85D43] hover:bg-[#FDFBF7]/80 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#EFEBE4] flex items-center justify-center text-[#B85D43]">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]">
                          Upload Photos
                        </span>
                        <span className="text-[11px] font-medium text-[#2C302E]/50">
                          JPG or PNG · up to {MAX_INSPIRATION_IMAGES} photos
                        </span>
                      </button>
                    )}

                    {inspirationImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {inspirationImages.map((img) => (
                          <div
                            key={img.id}
                            className="relative aspect-square rounded-2xl overflow-hidden border border-[#EFEBE4] bg-[#FDFBF7] group"
                          >
                            <Image
                              src={img.url}
                              alt="Inspiration preview"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeInspirationImage(img.id)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#2C302E]/80 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              aria-label="Remove photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-[#2C302E] text-[#FDFBF7] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#D4A373] transition-all duration-300 shadow-md flex items-center justify-center space-x-2 group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Custom Request</span>
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* --- MINIMALIST FOOTER NOTE --- */}
        <div className="pt-16 border-t border-[#EFEBE4] text-center space-y-2">
          <p className="font-serif text-2xl text-[#2C302E] font-medium">
            Contact Us Directly
          </p>
          <p className="text-xs text-[#2C302E]/60 uppercase tracking-widest font-mono font-bold">
            contact@kakucraft.com • Addis Ababa, Ethiopia
          </p>
        </div>
      </div>
    </main>
  );
};
