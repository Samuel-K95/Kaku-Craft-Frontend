'use client';

import React from 'react';
import { OrderStatus, AdminRole } from '@/types';
import { orderStatusLabel } from '@/context/AdminStoreContext';

export const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending_payment: 'bg-[#B85D43]/10 text-[#B85D43]',
    payment_submitted: 'bg-[#D4A373]/20 text-[#B85D43]',
    payment_verified: 'bg-[#52796F]/10 text-[#52796F]',
    in_progress: 'bg-[#D4A373]/15 text-[#D4A373]',
    delivered: 'bg-[#52796F]/10 text-[#52796F]',
    completed: 'bg-[#52796F]/10 text-[#52796F]',
    cancelled: 'bg-[#2C302E]/5 text-[#2C302E]/50',
  };

  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
        styles[status] || 'bg-[#EFEBE4] text-[#2C302E]'
      }`}
    >
      {orderStatusLabel(status)}
    </span>
  );
};

export const RoleBadge: React.FC<{ role: AdminRole }> = ({ role }) => {
  const styles: Record<AdminRole, string> = {
    ADMIN: 'bg-[#B85D43] text-white',
    EXPERT: 'bg-[#52796F]/15 text-[#52796F]',
    USER: 'bg-[#EFEBE4] text-[#2C302E]',
  };
  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${styles[role]}`}
    >
      {role}
    </span>
  );
};
