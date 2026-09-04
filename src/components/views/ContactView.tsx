// ============================================================================
// components/views/ContactView.tsx
// ============================================================================
'use client';

import React, { useState } from 'react';
import { Send, Sparkles, CheckCircle2, Mail, MapPin, Clock } from 'lucide-react';
import { ContactFormData } from '@/types';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    category: 'Custom Handcrafted Cardigan',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        category: 'Custom Handcrafted Cardigan',
        notes: ''
      });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <main className="relative min-h-screen py-16 px-4 md:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* --- EDITORIAL HEADER --- */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 backdrop-blur-sm px-5 py-2 rounded-full border border-[#EFEBE4]">
            <span>Commission Atelier</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#2C302E] leading-none tracking-tight">
            Bespoke <span className="italic font-normal text-[#B85D43]">Inquiries.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#2C302E]/70 leading-relaxed font-sans max-w-lg mx-auto">
            Have a custom colorway, sizing proportion, or heirloom character doll in mind? Transmit your project vision directly to our Addis Ababa studio.
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
                Crafted to your frame, <br />
                <span className="italic text-[#B85D43]">stitch by stitch.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#2C302E]/75 font-sans leading-relaxed">
                Every custom commission is assigned directly to a single artisan. We provide palette consultations, yarn dye matching, and progress dispatches.
              </p>
            </div>

            {/* Info Badges */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#EFEBE4]/80 backdrop-blur-md border border-[#EFEBE4] flex items-center space-x-3 text-xs text-[#2C302E]/80 font-mono">
                <MapPin className="w-4 h-4 text-[#B85D43] shrink-0" />
                <span>Atelier Location: Addis Ababa, Ethiopia</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#EFEBE4]/80 backdrop-blur-md border border-[#EFEBE4] flex items-center space-x-3 text-xs text-[#2C302E]/80 font-mono">
                <Clock className="w-4 h-4 text-[#52796F] shrink-0" />
                <span>Custom Turnaround: 2–3 Dedicated Weeks</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#EFEBE4]/80 backdrop-blur-md border border-[#EFEBE4] flex items-center space-x-3 text-xs text-[#2C302E]/80 font-mono">
                <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>Response Window: Within 24 Hours</span>
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
                  <h3 className="font-serif text-2xl text-[#2C302E]">Commission Dispatch Transmitted</h3>
                  <p className="text-xs text-[#2C302E]/70 max-w-sm mx-auto font-sans">
                    Thank you, {formData.fullName || 'Artisan Patron'}. Our studio coordinator will review your palette notes and respond within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
                        Patron Full Name
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="e.g. Liya Kebede" 
                        className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#D4A373] text-[#2C302E] shadow-sm transition-colors" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
                        Email Coordinates
                      </label>
                      <input 
                        required 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. patron@domain.com" 
                        className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#D4A373] text-[#2C302E] shadow-sm transition-colors" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
                      Artifact Category
                    </label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#D4A373] text-[#2C302E] shadow-sm transition-colors cursor-pointer"
                    >
                      <option>Custom Handcrafted Cardigan</option>
                      <option>Bespoke Raglan Cable Sweater</option>
                      <option>Architectural Raffia Handbag</option>
                      <option>Thermal Ribbed Beanie</option>
                      <option>Bespoke Collector Amigurumi Doll</option>
                      <option>Miniature Keychain Doll Mascot</option>
                      <option>Other Fiber Sculpture Commission</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
                      Project Vision & Dimension Notes
                    </label>
                    <textarea 
                      required 
                      rows={5} 
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Describe your desired palette, chest/sleeve measurements, or specific amigurumi character references..." 
                      className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl p-4 text-xs focus:outline-none focus:border-[#D4A373] text-[#2C302E] shadow-sm transition-colors" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 rounded-full bg-[#2C302E] text-[#FDFBF7] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4A373] transition-all duration-300 shadow-md flex items-center justify-center space-x-2 group"
                  >
                    <span>Transmit Commission Dispatch</span>
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* --- MINIMALIST FOOTER NOTE --- */}
        <div className="pt-16 border-t border-[#EFEBE4] text-center space-y-2">
          <p className="font-serif text-2xl text-[#2C302E]">
            Direct Atelier Inquiries
          </p>
          <p className="text-xs text-[#2C302E]/60 uppercase tracking-widest font-mono">
            contact@kakucraft.com • Addis Ababa, Ethiopia
          </p>
        </div>
      </div>
    </main>
  );
};