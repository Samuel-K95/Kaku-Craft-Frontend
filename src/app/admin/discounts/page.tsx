'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { SlideOverForm, adminInputClass, adminLabelClass } from '@/components/admin/SlideOverForm';
import { api, normalizeError } from '@/lib/api';
import { ApiDiscount } from '@/types/discounts';
import { ApiProduct } from '@/types/products';

type Draft = {
  id?: number;
  name: string;
  code: string;
  discount_type: 'percent' | 'amount';
  value: number;
  applies_to_all: boolean;
  product_ids: number[];
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

function discountStatus(d: ApiDiscount): 'active' | 'upcoming' | 'expired' {
  const now = Date.now();
  const start = new Date(d.starts_at).getTime();
  const end = new Date(d.ends_at).getTime();
  if (!d.is_active || end < now) return 'expired';
  if (start > now) return 'upcoming';
  return 'active';
}

const emptyDraft = (): Draft => ({
  name: '',
  code: '',
  discount_type: 'percent',
  value: 10,
  applies_to_all: false,
  product_ids: [],
  starts_at: new Date().toISOString(),
  ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  is_active: true,
});

export default function AdminDiscountsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const { data: discounts = [] } = useQuery({
    queryKey: ['admin-discounts'],
    queryFn: () => api.get<ApiDiscount[]>('/discounts/items/'),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get<ApiProduct[]>('/products/items/'),
  });

  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products]
  );

  const saveMutation = useMutation({
    mutationFn: async (draft: Draft) => {
      const payload = {
        name: draft.name,
        code: draft.code,
        discount_type: draft.discount_type,
        value: draft.value,
        applies_to_all: draft.applies_to_all,
        product_ids: draft.applies_to_all ? [] : draft.product_ids,
        starts_at: draft.starts_at,
        ends_at: draft.ends_at,
        is_active: draft.is_active,
      };
      if (draft.id) {
        return api.patch<ApiDiscount>(`/discounts/items/${draft.id}/`, payload);
      }
      return api.post<ApiDiscount>('/discounts/items/', payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
      setEditing(null);
      setError('');
    },
    onError: (err) => setError(normalizeError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/discounts/items/${id}/`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
      setConfirmId(null);
    },
    onError: (err) => setError(normalizeError(err)),
  });

  return (
    <div>
      <AdminPageHeader
        title="Discounts"
        description="Create timed discounts across selected products or the whole catalog."
        actions={
          <button
            type="button"
            onClick={() => setEditing(emptyDraft())}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#B85D43] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Discount
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-4 py-3 text-xs font-medium text-[#B85D43]">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {discounts.map((d) => {
          const status = discountStatus(d);
          const statusStyle =
            status === 'active'
              ? 'bg-[#52796F]/10 text-[#52796F]'
              : status === 'upcoming'
                ? 'bg-[#D4A373]/20 text-[#B85D43]'
                : 'bg-[#2C302E]/5 text-[#2C302E]/50';
          const ids = d.product_ids || [];
          const applies = d.applies_to_all
            ? 'All products'
            : `${ids.length} product${ids.length === 1 ? '' : 's'}`;
          const valueNum = typeof d.value === 'string' ? parseFloat(d.value) : d.value;

          return (
            <div
              key={d.id}
              className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 hover:border-[#D4A373]/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-2xl font-bold text-[#2C302E]">{d.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${statusStyle}`}
                    >
                      {status}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#2C302E]/40">
                      {d.code}
                    </span>
                  </div>
                  <p className="font-mono text-sm font-bold text-[#B85D43]">
                    {d.discount_type === 'percent' ? `${valueNum}% off` : `$${valueNum} off`}
                  </p>
                  <p className="text-xs font-medium text-[#2C302E]/60">
                    {applies} · {new Date(d.starts_at).toLocaleDateString()} –{' '}
                    {new Date(d.ends_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({
                        id: d.id,
                        name: d.name,
                        code: d.code,
                        discount_type: d.discount_type,
                        value: valueNum,
                        applies_to_all: d.applies_to_all,
                        product_ids: [...ids],
                        starts_at: d.starts_at,
                        ends_at: d.ends_at,
                        is_active: d.is_active,
                      })
                    }
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/10 hover:bg-[#EFEBE4]"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(d.id)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#B85D43] border border-[#B85D43]/20"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {discounts.length === 0 && (
          <p className="text-sm text-[#2C302E]/50 py-8 text-center">No discounts yet.</p>
        )}
      </div>

      <SlideOverForm
        open={!!editing}
        title={editing?.id ? 'Edit Discount' : 'New Discount'}
        onClose={() => setEditing(null)}
        widthClass="max-w-xl"
      >
        {editing && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(editing);
            }}
          >
            <div className="space-y-2">
              <label className={adminLabelClass}>Name</label>
              <input
                className={adminInputClass}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className={adminLabelClass}>Code</label>
              <input
                className={adminInputClass}
                value={editing.code}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    code: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={adminLabelClass}>Type</label>
                <select
                  className={adminInputClass}
                  value={editing.discount_type}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      discount_type: e.target.value as 'percent' | 'amount',
                    })
                  }
                >
                  <option value="percent">Percent %</option>
                  <option value="amount">Fixed $</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={adminLabelClass}>Value</label>
                <input
                  type="number"
                  className={adminInputClass}
                  value={editing.value}
                  onChange={(e) =>
                    setEditing({ ...editing, value: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={adminLabelClass}>Starts</label>
                <input
                  type="date"
                  className={adminInputClass}
                  value={editing.starts_at.slice(0, 10)}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      starts_at: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className={adminLabelClass}>Ends</label>
                <input
                  type="date"
                  className={adminInputClass}
                  value={editing.ends_at.slice(0, 10)}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      ends_at: new Date(e.target.value + 'T23:59:59').toISOString(),
                    })
                  }
                />
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={editing.is_active}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                className="accent-[#B85D43] w-4 h-4"
              />
              Active
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={editing.applies_to_all}
                onChange={(e) =>
                  setEditing({ ...editing, applies_to_all: e.target.checked })
                }
                className="accent-[#B85D43] w-4 h-4"
              />
              Apply to all products
            </label>
            {!editing.applies_to_all && (
              <div className="space-y-2">
                <label className={adminLabelClass}>Products</label>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {products.map((p) => {
                    const on = editing.product_ids.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-[#EFEBE4] cursor-pointer hover:bg-[#EFEBE4]/40"
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() =>
                            setEditing({
                              ...editing,
                              product_ids: on
                                ? editing.product_ids.filter((id) => id !== p.id)
                                : [...editing.product_ids, p.id],
                            })
                          }
                          className="accent-[#B85D43]"
                        />
                        <span className="text-sm font-medium">{p.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full py-3.5 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Saving…' : 'Save Discount'}
            </button>
          </form>
        )}
      </SlideOverForm>

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Discount"
        message="Remove this discount permanently?"
        confirmLabel="Delete"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId !== null) deleteMutation.mutate(confirmId);
        }}
      />
    </div>
  );
}
