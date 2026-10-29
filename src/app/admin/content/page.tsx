'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { adminInputClass, adminLabelClass } from '@/components/admin/SlideOverForm';
import { useAdminStore } from '@/context/AdminStoreContext';

const MAX_NEW_ARRIVALS = 4;

export default function AdminContentPage() {
  const { cms, setCms, products } = useAdminStore();
  const [draft, setDraft] = useState(cms);
  const [saved, setSaved] = useState(false);

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

  const handleSave = () => {
    setCms(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
            onClick={handleSave}
            className="px-6 py-3 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#9c4d37] transition-colors"
          >
            {saved ? 'Saved' : 'Save Content'}
          </button>
        }
      />

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
                      ${p.price}
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
