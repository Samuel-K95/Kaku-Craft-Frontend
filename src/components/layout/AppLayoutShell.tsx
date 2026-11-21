'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navigation />}
      <div className={`relative z-10 ${isAuthPage ? 'min-h-screen flex flex-col justify-center' : 'flex-1'}`}>
        {children}
      </div>
      {!isAuthPage && <Footer />}
    </>
  );
}
