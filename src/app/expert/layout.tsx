'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Scissors } from 'lucide-react';
import { RoleGate } from '@/components/auth/RoleGate';
import { useAuth } from '@/context/AuthContext';

function ExpertShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <main className="relative min-h-screen py-16 px-4 md:px-8 lg:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.3em] text-[#52796F] bg-[#EFEBE4]/80 px-5 py-2 rounded-full border border-[#EFEBE4]">
              <Scissors className="w-3.5 h-3.5" />
              Expert Desk
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#2C302E]">
              Your <span className="italic font-normal text-[#B85D43]">Work Queue.</span>
            </h1>
            <p className="text-sm font-medium text-[#2C302E]/60 max-w-lg">
              Start making, set how many days you need, and mark pieces finished when ready.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#EFEBE4]/50 border border-[#EFEBE4] rounded-[24px] px-5 py-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4A373]/40 shrink-0">
              <Image
                src={user?.avatarUrl || 'https://i.pravatar.cc/150?img=12'}
                alt={user?.fullName || 'Expert'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-serif text-lg font-bold">{user?.fullName || 'Expert'}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#52796F]">
                Expert
              </p>
            </div>
            <Link
              href="/"
              className="ml-2 text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 hover:text-[#B85D43]"
            >
              Shop
            </Link>
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate mode="expert">
      <ExpertShell>{children}</ExpertShell>
    </RoleGate>
  );
}
