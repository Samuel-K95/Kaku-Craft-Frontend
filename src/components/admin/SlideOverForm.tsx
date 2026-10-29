'use client';

import React from 'react';
import { X } from 'lucide-react';

interface SlideOverFormProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
}

export const SlideOverForm: React.FC<SlideOverFormProps> = ({
  open,
  title,
  onClose,
  children,
  widthClass = 'max-w-lg',
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-[#2C302E]/35 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div
        className={`relative w-full ${widthClass} h-full bg-[#FDFBF7] border-l border-[#EFEBE4] shadow-2xl overflow-y-auto p-6 sm:p-8`}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EFEBE4]">
          <h3 className="font-serif text-2xl text-[#2C302E]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#EFEBE4] flex items-center justify-center text-[#2C302E] hover:bg-[#D4A373]/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const adminInputClass =
  'w-full bg-[#EFEBE4]/40 border border-[#EFEBE4] rounded-2xl px-4 py-3 text-sm font-medium text-[#2C302E] focus:outline-none focus:border-[#D4A373] transition-colors';

export const adminLabelClass =
  'text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60';
