'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = register({ fullName, email, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push('/account');
  };

  return (
    <main className="relative min-h-[80vh] py-16 px-4 md:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-10 space-y-3">
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
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Liya Kebede"
              className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#D4A373] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#D4A373] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#D4A373] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C302E]">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type it again"
              className="w-full bg-[#FDFBF7] border border-[#EFEBE4] rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#D4A373] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#B85D43] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#9c4d37] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating…' : 'Create Account'}
          </button>

          <p className="text-center text-sm font-medium text-[#2C302E]/60 pt-2">
            Already have an account?{' '}
            <Link href="/signin" className="text-[#B85D43] font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
