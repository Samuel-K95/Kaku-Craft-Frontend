'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { SlideOverForm, adminInputClass, adminLabelClass } from '@/components/admin/SlideOverForm';
import { useAdminStore } from '@/context/AdminStoreContext';
import { MockDiscount } from '@/types';

function discountStatus(d: MockDiscount): 'active' | 'upcoming' | 'expired' {
  const now = Date.now();
  const start = new Date(d.startsAt).getTime();
  const end = new Date(d.endsAt).getTime();
  if (!d.active || end < now) return 'expired';
  if (start > now) return 'upcoming';
  return 'active';
}

const emptyDiscount = (): MockDiscount => ({
  id: `disc-${Date.now()}`,
  name: '',
  type: 'percent',
  value: 10,
  productIds: [],
  startsAt: new Date().toISOString(),
  endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  active: true,
});

export default function AdminDiscountsPage() {
  const { discounts, products, upsertDiscount, deleteDiscount } = useAdminStore();
  const [editing, setEditing] = useState<MockDiscount | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [applyAll, setApplyAll] = useState(false);

  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products]
  );

  const openNew = () => {
    setApplyAll(false);
    setEditing(emptyDiscount());
  };

  const openEdit = (d: MockDiscount) => {
    setApplyAll(d.productIds === 'all');
    setEditing({ ...d, productIds: d.productIds === 'all' ? [] : [...d.productIds] });
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.name) return;
    upsertDiscount({
      ...editing,
      productIds: applyAll ? 'all' : (editing.productIds as string[]),
    });
    setEditing(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="Discounts"
        description="Create timed discounts across selected products or the whole catalog."
        actions={
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#B85D43] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Discount
          </button>
        }
      />

      <div className="space-y-4">
        {discounts.map((d) => {
          const status = discountStatus(d);
          const statusStyle =
            status === 'active'
              ? 'bg-[#52796F]/10 text-[#52796F]'
              : status === 'upcoming'
                ? 'bg-[#D4A373]/20 text-[#B85D43]'
                : 'bg-[#2C302E]/5 text-[#2C302E]/50';

          const applies =
            d.productIds === 'all'
              ? 'All products'
              : `${d.productIds.length} product${d.productIds.length === 1 ? '' : 's'}`;

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
                  </div>
                  <p className="font-mono text-sm font-bold text-[#B85D43]">
                    {d.type === 'percent' ? `${d.value}% off` : `$${d.value} off`}
                  </p>
                  <p className="text-xs font-medium text-[#2C302E]/60">
                    {applies} · {new Date(d.startsAt).toLocaleDateString()} –{' '}
                    {new Date(d.endsAt).toLocaleDateString()}
                  </p>
                  {d.productIds !== 'all' && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {d.productIds.slice(0, 4).map((id) => (
                        <span
                          key={id}
                          className="px-2.5 py-1 rounded-full bg-[#EFEBE4] text-[10px] font-bold"
                        >
                          {productMap[id]?.name || id}
                        </span>
                      ))}
                      {d.productIds.length > 4 && (
                        <span className="text-[10px] font-bold text-[#2C302E]/40">
                          +{d.productIds.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(d)}
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
      </div>

      <SlideOverForm
        open={!!editing}
        title={
          editing && discounts.some((d) => d.id === editing.id)
            ? 'Edit Discount'
            : 'New Discount'
        }
        onClose={() => setEditing(null)}
        widthClass="max-w-xl"
      >
        {editing && (
          <form className="space-y-5" onSubmit={save}>
            <div className="space-y-2">
              <label className={adminLabelClass}>Name</label>
              <input
                className={adminInputClass}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={adminLabelClass}>Type</label>
                <select
                  className={adminInputClass}
                  value={editing.type}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      type: e.target.value as 'percent' | 'fixed',
                    })
                  }
                >
                  <option value="percent">Percent %</option>
                  <option value="fixed">Fixed $</option>
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
                  value={editing.startsAt.slice(0, 10)}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      startsAt: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className={adminLabelClass}>Ends</label>
                <input
                  type="date"
                  className={adminInputClass}
                  value={editing.endsAt.slice(0, 10)}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      endsAt: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                className="accent-[#B85D43] w-4 h-4"
              />
              Active
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={applyAll}
                onChange={(e) => setApplyAll(e.target.checked)}
                className="accent-[#B85D43] w-4 h-4"
              />
              Apply to all products
            </label>
            {!applyAll && (
              <div className="space-y-2">
                <label className={adminLabelClass}>Products</label>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {products.map((p) => {
                    const ids = editing.productIds as string[];
                    const on = ids.includes(p.id);
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
                              productIds: on
                                ? ids.filter((id) => id !== p.id)
                                : [...ids, p.id],
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
              className="w-full py-3.5 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold"
            >
              Save Discount
            </button>
          </form>
        )}
      </SlideOverForm>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete Discount"
        message="Remove this discount from the mock store?"
        confirmLabel="Delete"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) deleteDiscount(confirmId);
          setConfirmId(null);
        }}
      />
    </div>
  );
}
