'use client';

import React from 'react';
import { AdminStoreProvider } from '@/context/AdminStoreContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminStoreProvider>
      <main className="relative min-h-screen py-16 px-4 md:px-8 lg:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 space-y-2">
            <div className="inline-flex items-center text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 px-5 py-2 rounded-full border border-[#EFEBE4]">
              Kaku Craft Admin
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#2C302E]">
              Studio <span className="italic font-normal text-[#B85D43]">Desk.</span>
            </h1>
            <p className="text-sm font-medium text-[#2C302E]/60 max-w-lg">
              Manage users, products, orders, content, and discounts from one place.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <AdminSidebar />
            <section className="flex-1 min-w-0">{children}</section>
          </div>
        </div>
      </main>
    </AdminStoreProvider>
  );
}
