'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, hint, icon: Icon }) => {
  return (
    <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 hover:border-[#D4A373]/60 transition-all duration-500">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mb-2">
            {label}
          </p>
          <p className="font-serif text-3xl text-[#2C302E] font-bold">{value}</p>
          {hint && <p className="text-xs font-medium text-[#2C302E]/50 mt-2">{hint}</p>}
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#EFEBE4] flex items-center justify-center text-[#B85D43]">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
