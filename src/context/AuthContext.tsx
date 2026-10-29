'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MockUser } from '@/types';
import { ADMIN_USERS } from '@/data/admin/seed';
import { MOCK_USERS } from '@/data/mockStore';

type AuthUser = MockUser;

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => { ok: true; user: AuthUser } | { ok: false; error: string };
  register: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => { ok: true } | { ok: false; error: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Seed directory for mock sign-in (password ignored except non-empty). */
function buildDirectory(): AuthUser[] {
  const byEmail = new Map<string, AuthUser>();
  [...MOCK_USERS, ...ADMIN_USERS].forEach((u) => {
    byEmail.set(u.email.toLowerCase(), {
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      avatarUrl: u.avatarUrl,
      joinedAt: 'joinedAt' in u ? u.joinedAt : undefined,
    });
  });
  return Array.from(byEmail.values());
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [directory, setDirectory] = useState<AuthUser[]>(() => buildDirectory());
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(
    (email: string, password: string) => {
      if (!email.trim() || !password.trim()) {
        return { ok: false as const, error: 'Please enter your email and password.' };
      }
      const found = directory.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) {
        return {
          ok: false as const,
          error: 'No account found with that email. Try registering, or use a demo email.',
        };
      }
      setUser(found);
      return { ok: true as const, user: found };
    },
    [directory]
  );

  const register = useCallback(
    (data: { fullName: string; email: string; password: string }) => {
      const email = data.email.trim().toLowerCase();
      if (!data.fullName.trim() || !email || !data.password.trim()) {
        return { ok: false as const, error: 'Please fill in all fields.' };
      }
      if (data.password.length < 6) {
        return { ok: false as const, error: 'Password should be at least 6 characters.' };
      }
      if (directory.some((u) => u.email.toLowerCase() === email)) {
        return { ok: false as const, error: 'An account with this email already exists. Please sign in.' };
      }
      const newUser: AuthUser = {
        id: `u-${Date.now()}`,
        email: data.email.trim(),
        fullName: data.fullName.trim(),
        role: 'USER',
        avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
        joinedAt: new Date().toISOString(),
      };
      setDirectory((prev) => [...prev, newUser]);
      setUser(newUser);
      return { ok: true as const };
    },
    [directory]
  );

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
