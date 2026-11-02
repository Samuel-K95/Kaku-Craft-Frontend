'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isAdminUser, isExpertUser } from '@/data/mockStore';

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (isAdminUser(result.user)) router.push('/admin');
    else if (isExpertUser(result.user)) router.push('/expert');
    else router.push('/account');
  };

  return (
    <main className="relative min-h-[80vh] py-16 px-4 md:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 px-5 py-2 rounded-full border border-[#EFEBE4]">
            Welcome Back
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C302E]">
            Sign <span className="italic font-normal text-[#B85D43]">In.</span>
          </h1>
          <p className="text-sm font-medium text-[#2C302E]/60">
            Access your orders, custom requests, and account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-[#EFEBE4]/80 backdrop-blur-md p-8 sm:p-10 rounded-[36px] border border-[#EFEBE4] shadow-sm"
        >
          {error && (
            <div className="rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-4 py-3 text-xs font-medium text-[#B85D43]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. you@example.com"
              required
              className="w-full bg-[#FDFBF7]/60 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-[#B85D43]/40 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#FDFBF7]/60 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-[#B85D43]/40 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#2C302E] text-[#FDFBF7] py-4 rounded-2xl font-serif text-sm tracking-wide hover:bg-[#B85D43] transition-colors disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-medium text-[#2C302E]/60">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-[#B85D43] underline underline-offset-4 font-semibold hover:opacity-80"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
