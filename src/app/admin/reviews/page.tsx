'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { api, normalizeError } from '@/lib/api';
import { ApiReview } from '@/types/reviews';

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [error, setError] = React.useState('');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get<ApiReview[]>('/reviews/'),
  });

  const moderate = useMutation({
    mutationFn: (vars: { id: number; is_approved?: boolean; is_flagged?: boolean }) =>
      api.post(`/reviews/${vars.id}/moderate/`, {
        is_approved: vars.is_approved,
        is_flagged: vars.is_flagged,
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }),
    onError: (err) => setError(normalizeError(err)),
  });

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description="Approve or flag customer reviews before they appear on product pages."
      />
      {error && (
        <div className="mb-4 rounded-2xl bg-[#B85D43]/10 px-4 py-3 text-xs text-[#B85D43]">
          {error}
        </div>
      )}
      {isLoading && <p className="text-sm text-[#2C302E]/50">Loading…</p>}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 space-y-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-serif text-xl font-bold">{r.product_name}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/40">
                {r.rating}/5 · {r.user_email}
              </span>
              {!r.is_approved && (
                <span className="px-2 py-1 rounded-full bg-[#D4A373]/20 text-[10px] font-bold uppercase text-[#B85D43]">
                  Pending
                </span>
              )}
              {r.is_flagged && (
                <span className="px-2 py-1 rounded-full bg-[#B85D43]/10 text-[10px] font-bold uppercase text-[#B85D43]">
                  Flagged
                </span>
              )}
            </div>
            <p className="text-sm text-[#2C302E]/80">{r.comment}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => moderate.mutate({ id: r.id, is_approved: true, is_flagged: false })}
                className="px-4 py-2 rounded-full bg-[#52796F] text-white text-[10px] uppercase tracking-widest font-bold"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => moderate.mutate({ id: r.id, is_approved: false, is_flagged: true })}
                className="px-4 py-2 rounded-full border border-[#B85D43]/30 text-[#B85D43] text-[10px] uppercase tracking-widest font-bold"
              >
                Flag
              </button>
            </div>
          </div>
        ))}
        {!isLoading && reviews.length === 0 && (
          <p className="text-sm text-[#2C302E]/50 text-center py-8">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
