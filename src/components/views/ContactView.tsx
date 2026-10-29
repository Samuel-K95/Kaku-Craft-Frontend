// ============================================================================
// components/views/ContactView.tsx
// ============================================================================
'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Send, CheckCircle2, Mail, MapPin, Clock, UploadCloud, X } from 'lucide-react';
import { ContactFormData } from '@/types';

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
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    category: 'Cardigan',
    notes: ''
  });

  const [inspirationImages, setInspirationImages] = useState<InspirationPreview[]>([]);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        category: 'Cardigan',
        notes: ''
      });
      clearInspirationImages();
      setSubmitted(false);
    }, 4000);
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

          {/* Right Column: Frosted Form Workspace */}
          <div className="lg:col-span-7">
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6 bg-[#EFEBE4]/80 backdrop-blur-md p-8 md:p-12 rounded-[36px] border border-[#EFEBE4] shadow-sm"
            >
              {submitted ? (
                <div className="py-16 text-center space-y-3 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="w-12 h-12 text-[#52796F] mx-auto" />
                  <h3 className="font-serif text-2xl text-[#2C302E]">Request Sent Successfully</h3>
                  <p className="text-xs text-[#2C302E]/70 max-w-sm mx-auto font-sans font-medium">
                    Thank you, {formData.fullName || 'Customer'}. We will review your ideas and reply within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
                        Full Name
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="e.g. Liya Kebede" 
                        className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#D4A373] text-[#2C302E] shadow-sm transition-colors font-medium" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
                        Email Address
                      </label>
                      <input 
                        required 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com" 
                        className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#D4A373] text-[#2C302E] shadow-sm transition-colors font-medium" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
                      Product Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRODUCT_TYPES.map((type) => {
                        const isActive = formData.category === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, category: type }))}
                            className={`px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
                              isActive
                                ? 'bg-[#B85D43] text-white shadow-sm'
                                : 'bg-[#FDFBF7] text-[#2C302E]/70 border border-[#EFEBE4] hover:border-[#D4A373] hover:text-[#2C302E]'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
                      Your Ideas & Details
                    </label>
                    <textarea 
                      required 
                      rows={5} 
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Tell us about the colors you want, your size, or what kind of doll you'd like..." 
                      className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl p-4 text-xs focus:outline-none focus:border-[#D4A373] text-[#2C302E] shadow-sm transition-colors font-medium" 
                    />
                  </div>

                  {/* Inspiration photo upload */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
                        Inspiration Photos
                      </label>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#2C302E]/45">
                        {inspirationImages.length}/{MAX_INSPIRATION_IMAGES}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#2C302E]/60">
                      Upload pictures of styles, colors, or items you like. This helps us understand what you want.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
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
                    className="w-full py-4 rounded-full bg-[#2C302E] text-[#FDFBF7] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#D4A373] transition-all duration-300 shadow-md flex items-center justify-center space-x-2 group"
                  >
                    <span>Send Custom Request</span>
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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