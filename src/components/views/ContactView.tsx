// ============================================================================
// 14. components/views/ContactView.tsx
// ============================================================================
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ContactFormData } from '@/types';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    category: 'Custom Handcrafted Cardigan',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Inquiry transmitted for ${formData.fullName}!`);
    setFormData({
      fullName: '',
      email: '',
      category: 'Custom Handcrafted Cardigan',
      notes: ''
    });
  };

  return (
    <main className="py-16 px-6 md:px-12 max-w-3xl mx-auto min-h-screen">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4A373]">Commission Inquiries</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#2C302E]">Bespoke Order Atelier</h1>
        <p className="text-xs md:text-sm text-[#2C302E]/60">Have a custom colorway, sizing requirement, or doll concept in mind?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#EFEBE4]/40 p-8 md:p-12 rounded-3xl border border-[#EFEBE4]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-bold text-[#2C302E]">Full Name</label>
            <input 
              required 
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Abebe Bikila" 
              className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A373]" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-bold text-[#2C302E]">Email Coordinates</label>
            <input 
              required 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="abebe@example.com" 
              className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A373]" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-bold text-[#2C302E]">Garment Category</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A373]"
          >
            <option>Custom Handcrafted Cardigan</option>
            <option>Bespoke Collector Amigurumi Doll</option>
            <option>Raffia Handbag Architecture</option>
            <option>Other Fiber Sculpture Commission</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-bold text-[#2C302E]">Project Vision & Sizing Notes</label>
          <textarea 
            required 
            rows={5} 
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Describe desired palette, chest measurements, or character references..." 
            className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A373]" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-4 rounded-full bg-[#2C302E] text-[#FDFBF7] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#D4A373] transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <span>Transmit Commission Dispatch</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </main>
  );
};