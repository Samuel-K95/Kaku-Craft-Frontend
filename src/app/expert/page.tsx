'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Play, Clock } from 'lucide-react';
import { adminInputClass, adminLabelClass } from '@/components/admin/SlideOverForm';
import { api, normalizeError } from '@/lib/api';
import { ApiOrder } from '@/types/orders';

type ProdFilter = 'not_started' | 'in_progress' | 'completed' | 'all';
type SortMode = 'oldest' | 'newest' | 'eta';

const PROD_FILTERS: { id: ProdFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'not_started', label: 'Not Started' },
  { id: 'in_progress', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
];

function ProdBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    not_started: 'bg-[#2C302E]/5 text-[#2C302E]/60',
    in_progress: 'bg-[#D4A373]/20 text-[#B85D43]',
    completed: 'bg-[#52796F]/10 text-[#52796F]',
  };
  const label =
    status === 'in_progress' ? 'Ongoing' : status === 'completed' ? 'Completed' : 'Not Started';
  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
        styles[status] || styles.not_started
      }`}
    >
      {label}
    </span>
  );
}

export default function ExpertPage() {
  const queryClient = useQueryClient();
  const [prodFilter, setProdFilter] = useState<ProdFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('oldest');
  const [daysDraft, setDaysDraft] = useState<Record<number, string>>({});
  const [error, setError] = useState('');

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['expert-jobs'],
    queryFn: () => api.get<ApiOrder[]>('/orders/expert/jobs/'),
    staleTime: 10 * 1000,
  });

  const startMutation = useMutation({
    mutationFn: (vars: { id: number; days: number }) =>
      api.post<ApiOrder>(`/orders/${vars.id}/expert/start/`, { days: vars.days }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['expert-jobs'] }),
    onError: (err) => setError(normalizeError(err)),
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => api.post<ApiOrder>(`/orders/${id}/expert/complete/`, {}),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['expert-jobs'] }),
    onError: (err) => setError(normalizeError(err)),
  });

  const myJobs = useMemo(() => {
    let list = [...jobs];
    if (prodFilter !== 'all') {
      list = list.filter((o) => (o.production_status || 'not_started') === prodFilter);
    }
    list.sort((a, b) => {
      if (sortMode === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortMode === 'eta') {
        const ae = a.estimated_completion_days ?? 999;
        const be = b.estimated_completion_days ?? 999;
        return ae - be;
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    return list;
  }, [jobs, prodFilter, sortMode]);

  const counts = useMemo(() => {
    return {
      not_started: jobs.filter((o) => (o.production_status || 'not_started') === 'not_started')
        .length,
      in_progress: jobs.filter((o) => o.production_status === 'in_progress').length,
      completed: jobs.filter((o) => o.production_status === 'completed').length,
    };
  }, [jobs]);

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-4 py-3 text-xs font-medium text-[#B85D43]">
          {error}
        </div>
      )}

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

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] min-w-max overflow-x-auto">
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
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          className="rounded-full bg-[#FDFBF7] border border-[#EFEBE4] px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold text-[#2C302E] focus:outline-none focus:border-[#D4A373]"
        >
          <option value="oldest">Oldest First</option>
          <option value="newest">Newest First</option>
          <option value="eta">Soonest ETA</option>
        </select>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <p className="text-sm text-[#2C302E]/50 py-8 text-center">Loading your jobs…</p>
        )}
        {!isLoading && myJobs.length === 0 && (
          <div className="rounded-[28px] border border-[#EFEBE4] bg-[#EFEBE4]/40 p-12 text-center">
            <p className="font-serif text-2xl text-[#2C302E]">No jobs in this filter.</p>
            <p className="text-sm font-medium text-[#2C302E]/60 mt-2">
              Assigned work from the admin will show up here.
            </p>
          </div>
        )}

        {myJobs.map((order) => {
          const status = order.production_status || 'not_started';
          const suggested = order.estimated_completion_days || 7;
          const draftDays = daysDraft[order.id] ?? String(suggested);

          return (
            <div
              key={order.id}
              className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 hover:border-[#D4A373]/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 pb-5 border-b border-[#EFEBE4]">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest mb-2">
                    Order #{order.id}
                  </p>
                  <p className="text-xs font-medium text-[#2C302E]/50">
                    Ordered {new Date(order.created_at).toLocaleDateString()}
                    {order.estimated_completion_days
                      ? ` · ~${order.estimated_completion_days} days`
                      : ''}
                  </p>
                </div>
                <ProdBadge status={status} />
              </div>

              <div className="space-y-3 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-lg font-bold truncate">{item.product_name}</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mt-1">
                        Qty {item.quantity} · ${item.line_total}
                      </p>
                    </div>
                  </div>
                ))}
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
                    onClick={() =>
                      startMutation.mutate({
                        id: order.id,
                        days: Math.max(1, Number(draftDays) || suggested),
                      })
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#9c4d37]"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Start Making
                  </button>
                )}
                {status === 'in_progress' && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        startMutation.mutate({
                          id: order.id,
                          days: Math.max(1, Number(draftDays) || suggested),
                        })
                      }
                      className="px-4 py-2.5 rounded-full border border-[#2C302E]/15 text-[10px] uppercase tracking-widest font-bold hover:bg-[#FDFBF7]"
                    >
                      Update Days
                    </button>
                    <button
                      type="button"
                      onClick={() => completeMutation.mutate(order.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#52796F] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#3f5c55]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Finished
                    </button>
                  </>
                )}
                {status === 'completed' && (
                  <p className="text-xs font-medium text-[#52796F]">
                    Finished{' '}
                    {order.expert_completed_at
                      ? new Date(order.expert_completed_at).toLocaleDateString()
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
