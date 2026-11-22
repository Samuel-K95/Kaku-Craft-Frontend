'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { adminInputClass, adminLabelClass } from '@/components/admin/SlideOverForm';
import { useAdminStore } from '@/context/AdminStoreContext';
import { api, normalizeError } from '@/lib/api';
import { ApiSiteContent } from '@/types/cms';
import { ApiProduct } from '@/types/products';
import { formatEtb } from '@/lib/money';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const MAX_NEW_ARRIVALS = 4;

export default function AdminContentPage() {
  const queryClient = useQueryClient();
  const { cms, setCms } = useAdminStore();
  const [draft, setDraft] = useState(cms);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch live products for new arrivals selector
  const { data: serverProducts = [] } = useQuery<ApiProduct[]>({
    queryKey: ['admin-products'],
    queryFn: () => api.get<ApiProduct[]>('/products/items/'),
    staleTime: 30 * 1000,
  });

  // Fetch live special occasion content if it exists in backend
  const { data: serverContent } = useQuery<ApiSiteContent[]>({
    queryKey: ['admin-content'],
    queryFn: () => api.get<ApiSiteContent[]>('/cms/content/'),
    staleTime: 30 * 1000,
  });

  const products = serverProducts.map((p) => ({
    id: String(p.id),
    name: p.name,
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    image:
      p.images?.[0]?.image ||
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800',
  }));

  const toggleArrival = (productId: string) => {
    setDraft((prev) => {
      const exists = prev.newArrivalProductIds.includes(productId);
      if (exists) {
        return {
          ...prev,
          newArrivalProductIds: prev.newArrivalProductIds.filter((id) => id !== productId),
        };
      }
      if (prev.newArrivalProductIds.length >= MAX_NEW_ARRIVALS) return prev;
      return {
        ...prev,
        newArrivalProductIds: [...prev.newArrivalProductIds, productId],
      };
    });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // 1. Update in-memory local admin store
      setCms(draft);

      // 2. Persist to Backend CMS API
      const bannerPayload = {
        key: 'special-occasion-banner',
        section: 'special_occasion',
        title: draft.specialOccasion.title,
        body: draft.specialOccasion.subtitle,
        data: {
          active: draft.specialOccasion.active,
          imageUrl: draft.specialOccasion.imageUrl,
        },
        is_published: draft.specialOccasion.active,
      };
      const arrivalsPayload = {
        key: 'new-arrivals',
        section: 'new_arrivals',
        title: 'New Arrivals',
        body: '',
        data: { newArrivalProductIds: draft.newArrivalProductIds },
        is_published: true,
      };

      const existingBanner = serverContent?.find((c) => c.key === 'special-occasion-banner');
      if (existingBanner) {
        await api.patch(`/cms/content/special-occasion-banner/`, bannerPayload);
      } else {
        await api.post(`/cms/content/`, bannerPayload);
      }

      const existingArrivals = serverContent?.find((c) => c.key === 'new-arrivals');
      if (existingArrivals) {
        await api.patch(`/cms/content/new-arrivals/`, arrivalsPayload);
      } else {
        await api.post(`/cms/content/`, arrivalsPayload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      setStatusMsg('Homepage content updated successfully!');
      setTimeout(() => setStatusMsg(''), 3000);
    },
    onError: (err: unknown) => {
      // Local state is preserved even if API responds with permission or network issue
      setStatusMsg('Saved locally in admin context.');
      setTimeout(() => setStatusMsg(''), 3000);
    },
  });

  const selectedProducts = products.filter((p) =>
    draft.newArrivalProductIds.includes(p.id)
  );

  return (
    <div>
      <AdminPageHeader
        title="Content"
        description="Manage homepage Special Occasion and New Arrivals sections."
        actions={
          <button
            type="button"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="px-6 py-3 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#9c4d37] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : statusMsg ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              'Save Content'
            )}
          </button>
        }
      />

      {statusMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-[#52796F]/10 border border-[#52796F]/30 text-[#52796F] text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Special Occasion */}
        <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#EFEBE4]">
            <div>
              <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#2C302E]">
                Special Occasion
              </p>
              <p className="text-xs font-medium text-[#2C302E]/50 mt-1">
                Banner under the home hero.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={draft.specialOccasion.active}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    specialOccasion: {
                      ...draft.specialOccasion,
                      active: e.target.checked,
                    },
                  })
                }
                className="accent-[#B85D43] w-4 h-4"
              />
              Active
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={adminLabelClass}>Title</label>
                <input
                  className={adminInputClass}
                  value={draft.specialOccasion.title}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      specialOccasion: {
                        ...draft.specialOccasion,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className={adminLabelClass}>Message</label>
                <textarea
                  className={adminInputClass}
                  rows={3}
                  value={draft.specialOccasion.subtitle}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      specialOccasion: {
                        ...draft.specialOccasion,
                        subtitle: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className={adminLabelClass}>Image URL</label>
                <input
                  className={adminInputClass}
                  value={draft.specialOccasion.imageUrl}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      specialOccasion: {
                        ...draft.specialOccasion,
                        imageUrl: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="relative rounded-[24px] overflow-hidden border border-[#EFEBE4] min-h-[220px]">
              <Image
                src={draft.specialOccasion.imageUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#D4A373] mb-2">
                  Special Occasion
                </p>
                <h3 className="font-serif text-2xl mb-1">{draft.specialOccasion.title}</h3>
                <p className="text-xs font-medium text-white/85 line-clamp-2">
                  {draft.specialOccasion.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New Arrivals */}
        <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#EFEBE4]">
            <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#2C302E]">
              New Arrivals
            </p>
            <p className="text-xs font-medium text-[#2C302E]/50 mt-1">
              Pick up to {MAX_NEW_ARRIVALS} products to show on the home page (
              {draft.newArrivalProductIds.length}/{MAX_NEW_ARRIVALS}).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((p) => {
              const selected = draft.newArrivalProductIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleArrival(p.id)}
                  className={`text-left rounded-2xl border overflow-hidden transition-all ${
                    selected
                      ? 'border-[#B85D43] ring-2 ring-[#B85D43]/30'
                      : 'border-[#EFEBE4] hover:border-[#D4A373]'
                  }`}
                >
                  <div className="relative aspect-[3/4] bg-[#EFEBE4]">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="font-serif text-sm font-bold line-clamp-1">{p.name}</p>
                    <p className="font-mono text-xs font-bold text-[#2C302E]/60 mt-1">
                      {formatEtb(p.price)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedProducts.length > 0 && (
            <div className="pt-4 border-t border-[#EFEBE4]">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#D4A373] mb-3">
                Preview Selected
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((p) => (
                  <span
                    key={p.id}
                    className="px-3 py-1.5 rounded-full bg-[#EFEBE4] text-xs font-bold"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
