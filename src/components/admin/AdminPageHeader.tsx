'use client';

import React from 'react';

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  eyebrow = 'Admin',
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div className="space-y-2">
        <div className="inline-flex items-center text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 px-4 py-1.5 rounded-full border border-[#EFEBE4]">
          {eyebrow}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2C302E]">{title}</h1>
        {description && (
          <p className="text-sm font-medium text-[#2C302E]/60 max-w-xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
};
