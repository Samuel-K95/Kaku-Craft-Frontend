'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, normalizeError } from '@/lib/api';
import { ApiOrder } from '@/types/orders';
import { ApiReview } from '@/types/reviews';

export const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [orderId, setOrderId] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () =>
      api.get<ApiReview[]>(`/reviews/?product=${encodeURIComponent(productId)}`, {
        requiresAuth: false,
      }),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get<ApiOrder[]>('/orders/'),
    enabled: isAuthenticated,
  });

  const eligibleOrders = useMemo(() => {
    const pid = Number(productId);
    return orders.filter(
      (o) =>
        o.status === 'completed' &&
        o.items.some((i) => i.product === pid || String(i.product) === productId)
    );
  }, [orders, productId]);

  const createMutation = useMutation({
    mutationFn: () =>
      api.post<ApiReview>('/reviews/', {
        product: Number(productId),
        order: orderId,
        rating,
        comment,
      }),
    onSuccess: () => {
      setMsg('Review submitted for moderation. Thank you!');
      setComment('');
      setError('');
      void queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    },
    onError: (err) => setError(normalizeError(err)),
  });

  return (
    <section className="space-y-6 border-t border-[#EFEBE4] pt-10">
      <div>
        <h2 className="font-serif text-3xl text-[#2C302E]">Reviews</h2>
        <p className="text-sm text-[#2C302E]/60 mt-1">
          What customers say after receiving their piece.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 && (
          <p className="text-sm text-[#2C302E]/50">No approved reviews yet.</p>
        )}
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-[#EFEBE4] bg-[#FDFBF7] p-5 space-y-2"
          >
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < r.rating ? 'fill-[#D4A373] text-[#D4A373]' : 'text-[#EFEBE4]'
                  }`}
                />
              ))}
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/40">
                {r.user_email}
              </span>
            </div>
            <p className="text-sm font-medium text-[#2C302E]/80">{r.comment}</p>
          </div>
        ))}
      </div>

      {isAuthenticated && eligibleOrders.length > 0 && (
        <form
          className="rounded-[28px] border border-[#EFEBE4] bg-[#EFEBE4]/40 p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!orderId) {
              setError('Select the completed order this review is for.');
              return;
            }
            createMutation.mutate();
          }}
        >
          <h3 className="font-serif text-xl">Write a review</h3>
          {error && <p className="text-xs text-[#B85D43]">{error}</p>}
          {msg && <p className="text-xs text-[#52796F]">{msg}</p>}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold">Order</label>
            <select
              className="w-full rounded-2xl border border-[#EFEBE4] bg-[#FDFBF7] px-4 py-3 text-sm"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value ? Number(e.target.value) : '')}
              required
            >
              <option value="">Select completed order…</option>
              {eligibleOrders.map((o) => (
                <option key={o.id} value={o.id}>
                  Order #{o.id}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold">Rating</label>
            <select
              className="w-full rounded-2xl border border-[#EFEBE4] bg-[#FDFBF7] px-4 py-3 text-sm"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold">Comment</label>
            <textarea
              required
              rows={3}
              className="w-full rounded-2xl border border-[#EFEBE4] bg-[#FDFBF7] px-4 py-3 text-sm"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-3 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-widest font-bold disabled:opacity-50"
          >
            Submit Review
          </button>
        </form>
      )}
    </section>
  );
};
