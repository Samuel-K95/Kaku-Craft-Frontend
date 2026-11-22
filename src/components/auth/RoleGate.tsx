'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isAdminUser, isExpertUser, RoleLike } from '@/lib/roles';

type GateMode = 'admin' | 'expert';

function allowed(mode: GateMode, user: RoleLike): boolean {
  if (mode === 'admin') return isAdminUser(user);
  return isExpertUser(user) || isAdminUser(user);
}

export const RoleGate: React.FC<{ mode: GateMode; children: React.ReactNode }> = ({
  mode,
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/signin');
      return;
    }
    if (!allowed(mode, user)) {
      router.replace('/account');
    }
  }, [isLoading, isAuthenticated, user, mode, router]);

  if (isLoading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-[#FDFBF7]/70 text-[#2C302E]">
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#2C302E]/50">
          Checking access…
        </p>
      </main>
    );
  }

  if (!isAuthenticated || !allowed(mode, user)) {
    return null;
  }

  return <>{children}</>;
};
