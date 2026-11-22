'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User, BackendUserPayload, LoginResponse, RegisterResponse } from '@/types/auth';
import {
  api,
  clearStoredTokens,
  getStoredTokens,
  mapBackendUser,
  normalizeError,
  setStoredTokens,
} from '@/lib/api';
import { clearServerSession, establishServerSession } from '@/lib/auth-session';

export type AuthUser = User;

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<{ ok: true; user?: AuthUser } | { ok: false; error: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = useCallback(async () => {
    const tokens = getStoredTokens();
    if (!tokens?.access) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.get<BackendUserPayload>('/users/profile/');
      setUser(mapBackendUser(data));
      // Re-assert httpOnly cookies after reload (role verified against Django).
      await establishServerSession(tokens);
    } catch {
      setUser(null);
      clearStoredTokens();
      await clearServerSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return { ok: false as const, error: 'Please enter your email and password.' };
    }

    try {
      const data = await api.post<LoginResponse>(
        '/users/auth/signin/',
        { email: email.trim(), password },
        { requiresAuth: false }
      );

      setStoredTokens({ access: data.access, refresh: data.refresh });
      const session = await establishServerSession({
        access: data.access,
        refresh: data.refresh,
      });
      if (!session.ok) {
        clearStoredTokens();
        return { ok: false as const, error: session.error };
      }

      const loggedInUser = mapBackendUser(data.user);
      setUser(loggedInUser);
      return { ok: true as const, user: loggedInUser };
    } catch (err) {
      return { ok: false as const, error: normalizeError(err) };
    }
  }, []);

  const register = useCallback(
    async (data: { fullName: string; email: string; password: string }) => {
      const email = data.email.trim();
      const fullName = data.fullName.trim();
      const password = data.password;

      if (!fullName || !email || !password) {
        return { ok: false as const, error: 'Please fill in all fields.' };
      }
      if (password.length < 8) {
        return { ok: false as const, error: 'Password must be at least 8 characters long.' };
      }

      try {
        await api.post<RegisterResponse>(
          '/users/auth/signup/',
          {
            email,
            full_name: fullName,
            password,
          },
          { requiresAuth: false }
        );

        return await login(email, password);
      } catch (err) {
        return { ok: false as const, error: normalizeError(err) };
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    void clearServerSession();
    clearStoredTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, isLoading, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
