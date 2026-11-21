'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SeededAccountsCard } from '@/components/auth/SeededAccountsCard';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await register({ fullName, email, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push('/account');
  };

  return (
    <main className="relative min-h-screen w-full py-12 px-4 md:px-12 flex flex-col justify-center items-center text-[#2C302E]">
      <div className="w-full max-w-lg mx-auto relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#2C302E]/60 hover:text-[#B85D43] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Studio
          </Link>
          <span className="font-serif italic text-sm text-[#D4A373]">Kaku Craft</span>
        </div>

        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 px-5 py-2 rounded-full border border-[#EFEBE4]">
            Join Kaku Craft
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C302E]">
            Create <span className="italic font-normal text-[#B85D43]">Account.</span>
          </h1>
          <p className="text-sm font-medium text-[#2C302E]/60">
            Save orders, track making progress, and request custom pieces.
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
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sara Tekle"
              required
              className="w-full bg-[#FDFBF7]/60 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-[#B85D43]/40 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sara@example.com"
              required
              className="w-full bg-[#FDFBF7]/60 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-[#B85D43]/40 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
              Password (min 8 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full bg-[#FDFBF7]/60 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-[#B85D43]/40 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full bg-[#FDFBF7]/60 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-[#B85D43]/40 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#2C302E] text-[#FDFBF7] py-4 rounded-2xl font-serif text-sm tracking-wide hover:bg-[#B85D43] transition-colors disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-medium text-[#2C302E]/60">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="text-[#B85D43] underline underline-offset-4 font-semibold hover:opacity-80"
          >
            Sign in
          </Link>
        </p>

        <SeededAccountsCard />
      </div>
    </main>
  );
}
