'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Play, Clock } from 'lucide-react';
import { useAdminStore } from '@/context/AdminStoreContext';
import { adminInputClass, adminLabelClass } from '@/components/admin/SlideOverForm';
import { ProductionStatus } from '@/types';
import { IN_STOCK_MAX_DAYS, IN_STOCK_MIN_DAYS } from '@/lib/stock';
import { useAuth } from '@/context/AuthContext';

type ProdFilter = ProductionStatus | 'all';
type PrecedenceSort = 'precedence' | 'oldest' | 'newest' | 'eta';

const PROD_FILTERS: { id: ProdFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'not_started', label: 'Not Started' },
  { id: 'in_progress', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
];

function prodLabel(status: ProductionStatus): string {
  switch (status) {
    case 'not_started':
      return 'Not Started';
    case 'in_progress':
      return 'Ongoing';
    case 'completed':
      return 'Completed';
  }
}

function ProdBadge({ status }: { status: ProductionStatus }) {
  const styles: Record<ProductionStatus, string> = {
    not_started: 'bg-[#2C302E]/5 text-[#2C302E]/60',
    in_progress: 'bg-[#D4A373]/20 text-[#B85D43]',
    completed: 'bg-[#52796F]/10 text-[#52796F]',
  };
  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${styles[status]}`}
    >
      {prodLabel(status)}
    </span>
  );
}

export default function ExpertPage() {
  const { orders, products, categories, updateOrder, users } = useAdminStore();
  const { user } = useAuth();
  const expertId =
    user?.id || users.find((u) => u.role === 'EXPERT')?.id || 'e-1';

  const [prodFilter, setProdFilter] = useState<ProdFilter>('all');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [precedenceSort, setPrecedenceSort] = useState<PrecedenceSort>('precedence');
  const [daysDraft, setDaysDraft] = useState<Record<string, string>>({});

  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products]
  );
  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const myJobs = useMemo(() => {
    let list = orders.filter((o) => o.assignedExpertId === expertId);

    if (prodFilter !== 'all') {
      list = list.filter((o) => (o.productionStatus || 'not_started') === prodFilter);
    }

    if (categoryId !== 'all') {
      list = list.filter((o) =>
        o.items.some((item) => productMap[item.productId]?.categoryId === categoryId)
      );
    }

    list = [...list].sort((a, b) => {
      if (precedenceSort === 'precedence') {
        return (a.precedence ?? 99) - (b.precedence ?? 99);
      }
      if (precedenceSort === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (precedenceSort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // eta
      const ae = a.estimatedCompletionAt ? new Date(a.estimatedCompletionAt).getTime() : Infinity;
      const be = b.estimatedCompletionAt ? new Date(b.estimatedCompletionAt).getTime() : Infinity;
      return ae - be;
    });

    return list;
  }, [orders, expertId, prodFilter, categoryId, precedenceSort, productMap]);

  const counts = useMemo(() => {
    const mine = orders.filter((o) => o.assignedExpertId === expertId);
    return {
      not_started: mine.filter((o) => (o.productionStatus || 'not_started') === 'not_started')
        .length,
      in_progress: mine.filter((o) => o.productionStatus === 'in_progress').length,
      completed: mine.filter((o) => o.productionStatus === 'completed').length,
    };
  }, [orders, expertId]);

  const startJob = (orderId: string, suggestedDays: number) => {
    const days = Number(daysDraft[orderId] || suggestedDays);
    const eta = new Date();
    eta.setDate(eta.getDate() + Math.max(1, days));
    updateOrder(orderId, {
      productionStatus: 'in_progress',
      expertEstimatedDays: Math.max(1, days),
      productionStartedAt: new Date().toISOString(),
      estimatedCompletionAt: eta.toISOString(),
      status: 'in_progress',
    });
  };

  const finishJob = (orderId: string) => {
    updateOrder(orderId, {
      productionStatus: 'completed',
      productionCompletedAt: new Date().toISOString(),
      status: 'delivered',
    });
  };

  const updateDays = (orderId: string) => {
    const days = Number(daysDraft[orderId]);
    if (!days || days < 1) return;
    const eta = new Date();
    eta.setDate(eta.getDate() + days);
    updateOrder(orderId, {
      expertEstimatedDays: days,
      estimatedCompletionAt: eta.toISOString(),
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {(
          [
            ['not_started', 'Not Started', counts.not_started],
            ['in_progress', 'Ongoing', counts.in_progress],
            ['completed', 'Completed', counts.completed],
          ] as const
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => setProdFilter(id)}
            className={`rounded-[24px] border p-5 text-left transition-all ${
              prodFilter === id
                ? 'border-[#B85D43] bg-[#FDFBF7] shadow-sm'
                : 'border-[#EFEBE4] bg-[#EFEBE4]/40 hover:border-[#D4A373]/50'
            }`}
          >
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50">
              {label}
            </p>
            <p className="font-serif text-3xl font-bold mt-1">{count}</p>
          </button>
        ))}
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] min-w-max">
            {PROD_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setProdFilter(f.id)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${
                  prodFilter === f.id
                    ? 'bg-[#B85D43] text-white'
                    : 'text-[#2C302E]/70 hover:bg-[#FDFBF7]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] flex-1">
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] min-w-max">
              <button
                type="button"
                onClick={() => setCategoryId('all')}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                  categoryId === 'all'
                    ? 'bg-[#2C302E] text-white'
                    : 'text-[#2C302E]/70 hover:bg-[#FDFBF7]'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${
                    categoryId === c.id
                      ? 'bg-[#2C302E] text-white'
                      : 'text-[#2C302E]/70 hover:bg-[#FDFBF7]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <select
            value={precedenceSort}
            onChange={(e) => setPrecedenceSort(e.target.value as PrecedenceSort)}
            className="rounded-full bg-[#FDFBF7] border border-[#EFEBE4] px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold text-[#2C302E] focus:outline-none focus:border-[#D4A373]"
          >
            <option value="precedence">Order by Precedence</option>
            <option value="oldest">Oldest First</option>
            <option value="newest">Newest First</option>
            <option value="eta">Soonest ETA</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {myJobs.length === 0 && (
          <div className="rounded-[28px] border border-[#EFEBE4] bg-[#EFEBE4]/40 p-12 text-center">
            <p className="font-serif text-2xl text-[#2C302E]">No jobs in this filter.</p>
            <p className="text-sm font-medium text-[#2C302E]/60 mt-2">
              Assigned work from the admin will show up here.
            </p>
          </div>
        )}

        {myJobs.map((order) => {
          const status = (order.productionStatus || 'not_started') as ProductionStatus;
          const suggested =
            order.expertEstimatedDays ||
            Math.max(...order.items.map((i) => i.promisedDays), IN_STOCK_MAX_DAYS);
          const draftDays = daysDraft[order.id] ?? String(suggested);

          return (
            <div
              key={order.id}
              className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 hover:border-[#D4A373]/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 pb-5 border-b border-[#EFEBE4]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest">
                      {order.id}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4A373]">
                      Precedence #{order.precedence ?? '—'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#2C302E]/50">
                    Ordered {new Date(order.createdAt).toLocaleDateString()}
                    {order.estimatedCompletionAt &&
                      ` · ETA ${new Date(order.estimatedCompletionAt).toLocaleDateString()}`}
                  </p>
                </div>
                <ProdBadge status={status} />
              </div>

              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => {
                  const prod = productMap[item.productId];
                  const cat = prod ? categoryMap[prod.categoryId] : null;
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="relative w-16 h-20 rounded-t-[28px] rounded-b-[12px] overflow-hidden bg-[#EFEBE4] shrink-0 border border-[#EFEBE4]">
                        {prod && (
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-lg font-bold truncate">
                          {prod?.name || item.productId}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mt-1">
                          {cat?.name || 'Item'} · Qty {item.quantity} ·{' '}
                          {item.fulfillment === 'in_stock'
                            ? `In Stock · ${IN_STOCK_MIN_DAYS}–${IN_STOCK_MAX_DAYS} days`
                            : `Pre-Order · ~${item.promisedDays} days`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {status !== 'completed' && (
                <div className="rounded-2xl bg-[#EFEBE4]/50 border border-[#EFEBE4] p-4 mb-5">
                  <label className={adminLabelClass}>Days to finish</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <input
                      type="number"
                      min={1}
                      className={`${adminInputClass} max-w-[120px]`}
                      value={draftDays}
                      onChange={(e) =>
                        setDaysDraft((prev) => ({ ...prev, [order.id]: e.target.value }))
                      }
                    />
                    {status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => updateDays(order.id)}
                        className="px-4 py-2.5 rounded-full border border-[#2C302E]/15 text-[10px] uppercase tracking-widest font-bold hover:bg-[#FDFBF7]"
                      >
                        Update Days
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] font-medium text-[#2C302E]/45 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Set how many days you need before finishing this job.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {status === 'not_started' && (
                  <button
                    type="button"
                    onClick={() => startJob(order.id, Number(draftDays) || suggested)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#9c4d37]"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Start Making
                  </button>
                )}
                {status === 'in_progress' && (
                  <button
                    type="button"
                    onClick={() => finishJob(order.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#52796F] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#3f5c55]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Finished
                  </button>
                )}
                {status === 'completed' && (
                  <p className="text-xs font-medium text-[#52796F]">
                    Finished{' '}
                    {order.productionCompletedAt
                      ? new Date(order.productionCompletedAt).toLocaleDateString()
                      : ''}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
