'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { FaqAssistantWidget } from '@/components/cms/FaqAssistantWidget';

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Top navigation and footer are exclusively for customer/public storefront pages.
  // Hidden on Auth (/signin, /register), Admin (/admin/*), and Expert (/expert/*) workspaces.
  const isCustomerPage =
    !pathname.startsWith('/signin') &&
    !pathname.startsWith('/register') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/expert');

  const isAuthPage = pathname === '/signin' || pathname === '/register';

  return (
    <>
      {isCustomerPage && <Navigation />}
      <div
        className={`relative z-10 ${
          isAuthPage ? 'min-h-screen flex flex-col justify-center' : 'flex-1'
        }`}
      >
        {children}
      </div>
      {isCustomerPage && <Footer />}
      {isCustomerPage && !isAuthPage && <FaqAssistantWidget />}
    </>
  );
}
