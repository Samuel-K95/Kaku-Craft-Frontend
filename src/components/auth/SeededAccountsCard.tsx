'use client';

import React, { useState } from 'react';
import { KeyRound, Check, Copy, Shield, Sparkles, User, Palette, Wrench } from 'lucide-react';

export interface SeededAccount {
  role: string;
  roleKey: string;
  email: string;
  password: string;
  badge: string;
  description: string;
  icon: React.ElementType;
}

export const SEEDED_ACCOUNTS: SeededAccount[] = [
  {
    role: 'Customer',
    roleKey: 'customer',
    email: 'customer@kakucraft.com',
    password: 'KakuCustomer2024!',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Cart, 50% deposit checkout, custom orders & account dashboard',
    icon: User,
  },
  {
    role: 'User (Member)',
    roleKey: 'user',
    email: 'user@kakucraft.com',
    password: 'KakuUser2024!',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Standard member account for general testing and order history',
    icon: User,
  },
  {
    role: 'Expert / Artisan',
    roleKey: 'expert',
    email: 'expert@kakucraft.com',
    password: 'KakuExpert2024!',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Artisan work queue, crafting progression & completion ETAs',
    icon: Palette,
  },
  {
    role: 'Admin',
    roleKey: 'admin',
    email: 'admin@kakucraft.com',
    password: 'KakuAdmin2024!',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Verify deposit receipts, manage catalog, orders & content',
    icon: Shield,
  },
  {
    role: 'Super Admin',
    roleKey: 'super_admin',
    email: 'superadmin@kakucraft.com',
    password: 'KakuSuperAdmin2024!',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Full store oversight, staff permissions, and administrative controls',
    icon: Shield,
  },
  {
    role: 'System Admin',
    roleKey: 'system_admin',
    email: 'system@kakucraft.com',
    password: 'KakuSystem2024!',
    badge: 'bg-stone-900 text-stone-100 border-stone-800',
    description: 'Superuser with User Impersonation engine (can sign in as any user)',
    icon: Wrench,
  },
];

interface SeededAccountsCardProps {
  onSelectAccount?: (email: string, password: string) => void;
  selectedEmail?: string;
}

export function SeededAccountsCard({ onSelectAccount, selectedEmail }: SeededAccountsCardProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, email: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="mt-8 bg-[#EFEBE4]/90 backdrop-blur-md rounded-[32px] p-6 border border-[#EFEBE4] shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2C302E]/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#D4A373]/20 flex items-center justify-center text-[#B85D43]">
            <KeyRound className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#2C302E] flex items-center gap-1.5">
              Seeded Test Accounts
              <span className="text-[10px] lowercase tracking-normal text-[#B85D43] font-semibold bg-[#B85D43]/10 px-2 py-0.5 rounded-full">
                6 roles
              </span>
            </h3>
            <p className="text-[11px] text-[#2C302E]/60 mt-0.5">
              {onSelectAccount
                ? 'Click any account to automatically fill login credentials.'
                : 'Pre-seeded accounts ready for testing on the Sign In page.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SEEDED_ACCOUNTS.map((acc) => {
          const isSelected = selectedEmail === acc.email;
          const Icon = acc.icon;

          return (
            <div
              key={acc.email}
              onClick={() => onSelectAccount && onSelectAccount(acc.email, acc.password)}
              className={`group text-left p-3.5 rounded-2xl border transition-all ${
                onSelectAccount ? 'cursor-pointer hover:border-[#B85D43]/50 hover:bg-[#FDFBF7]/80' : ''
              } ${
                isSelected
                  ? 'border-[#B85D43] bg-[#FDFBF7] shadow-sm ring-1 ring-[#B85D43]/30'
                  : 'border-[#2C302E]/10 bg-[#FDFBF7]/50'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${acc.badge}`}
                >
                  <Icon className="w-2.5 h-2.5" />
                  {acc.role}
                </span>

                <div className="flex items-center gap-1">
                  {onSelectAccount && isSelected && (
                    <span className="text-[10px] text-[#B85D43] font-bold flex items-center gap-0.5 bg-[#B85D43]/10 px-1.5 py-0.5 rounded-md">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, `${acc.email} | ${acc.password}`, acc.email)}
                    title="Copy email & password"
                    className="p-1 text-[#2C302E]/40 hover:text-[#2C302E] rounded-md transition-colors"
                  >
                    {copiedEmail === acc.email ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="font-mono text-[11px] text-[#2C302E] font-medium truncate select-all">
                {acc.email}
              </div>
              <div className="font-mono text-[10px] text-[#2C302E]/50 mt-0.5 select-all">
                pw: <span className="text-[#2C302E]/70 font-semibold">{acc.password}</span>
              </div>
              <p className="text-[10px] text-[#2C302E]/60 mt-1 line-clamp-1">
                {acc.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
