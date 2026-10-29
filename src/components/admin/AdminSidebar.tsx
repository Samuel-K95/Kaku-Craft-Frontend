'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  FileText,
  Percent,
  LogOut,
} from 'lucide-react';
import { useAdminStore } from '@/context/AdminStoreContext';

const NAV = [
  { href: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/discounts', label: 'Discounts', icon: Percent },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentAdmin } = useAdminStore();

  return (
    <aside className="w-full lg:w-72 shrink-0 self-start lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
      <div className="bg-[#EFEBE4]/50 p-6 rounded-[28px] border border-[#EFEBE4] backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4A373]/40 shadow-sm">
            <Image
              src={currentAdmin.avatarUrl || 'https://i.pravatar.cc/150?img=68'}
              alt={currentAdmin.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-serif text-xl text-[#2C302E] font-bold truncate">
              {currentAdmin.fullName}
            </p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#B85D43]">
              {currentAdmin.role}
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {NAV.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-full text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-[#B85D43] text-white shadow-sm'
                    : 'text-[#2C302E]/70 hover:bg-[#FDFBF7] hover:text-[#2C302E]'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="text-xs uppercase tracking-widest font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-[#2C302E]/10">
          <Link
            href="/"
            className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-full text-[#2C302E]/50 hover:text-[#B85D43] hover:bg-[#FDFBF7] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-bold">Back to Shop</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
