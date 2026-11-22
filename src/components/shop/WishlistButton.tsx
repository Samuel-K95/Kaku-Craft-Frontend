'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { ApiWishlistItem } from '@/types/reviews';

export const WishlistButton: React.FC<{
  productId: string | number;
  className?: string;
}> = ({ productId, className = '' }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const numericId = Number(productId);

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get<ApiWishlistItem[]>('/reviews/wishlist/'),
    enabled: isAuthenticated && !Number.isNaN(numericId),
  });

  const wished = wishlist.some((w) => w.product === numericId);

  const toggle = useMutation({
    mutationFn: async () => {
      if (wished) {
        await api.delete(`/reviews/wishlist/${numericId}/`);
      } else {
        await api.post('/reviews/wishlist/', { product_id: numericId });
      }
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  if (!isAuthenticated || Number.isNaN(numericId)) return null;

  return (
    <button
      type="button"
      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={(e) => {
        e.stopPropagation();
        toggle.mutate();
      }}
      className={`inline-flex items-center justify-center rounded-full border transition-colors ${
        wished
          ? 'bg-[#B85D43] border-[#B85D43] text-white'
          : 'bg-[#FDFBF7]/90 border-[#EFEBE4] text-[#2C302E] hover:border-[#B85D43]'
      } ${className}`}
    >
      <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
    </button>
  );
};
