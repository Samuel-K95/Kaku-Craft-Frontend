'use client';

import React from 'react';

export type PeriodKey = '7d' | '1m' | '3m' | 'custom';

interface PeriodFilterProps {
  value: PeriodKey;
  onChange: (value: PeriodKey) => void;
  customFrom?: string;
  customTo?: string;
  onCustomFromChange?: (v: string) => void;
  onCustomToChange?: (v: string) => void;
}

const OPTIONS: { id: PeriodKey; label: string }[] = [
  { id: '7d', label: '7 Days' },
  { id: '1m', label: '1 Month' },
  { id: '3m', label: '3 Months' },
  { id: 'custom', label: 'Custom' },
];

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  value,
  onChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4]">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
              value === opt.id
                ? 'bg-[#B85D43] text-white shadow-sm'
                : 'text-[#2C302E]/70 hover:bg-[#FDFBF7]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {value === 'custom' && (
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={customFrom || ''}
            onChange={(e) => onCustomFromChange?.(e.target.value)}
            className="bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-2.5 text-xs font-medium text-[#2C302E] focus:outline-none focus:border-[#D4A373]"
          />
          <input
            type="date"
            value={customTo || ''}
            onChange={(e) => onCustomToChange?.(e.target.value)}
            className="bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-2.5 text-xs font-medium text-[#2C302E] focus:outline-none focus:border-[#D4A373]"
          />
        </div>
      )}
    </div>
  );
};

export function getPeriodRange(
  key: PeriodKey,
  customFrom?: string,
  customTo?: string
): { from: Date; to: Date } {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date();

  if (key === '7d') {
    from.setDate(from.getDate() - 7);
  } else if (key === '3m') {
    from.setMonth(from.getMonth() - 3);
  } else if (key === 'custom' && customFrom && customTo) {
    return { from: new Date(customFrom), to: new Date(customTo) };
  } else {
    // default 1 month
    from.setMonth(from.getMonth() - 1);
  }
  from.setHours(0, 0, 0, 0);
  return { from, to };
}
