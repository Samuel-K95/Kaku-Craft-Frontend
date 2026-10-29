'use client';

import React, { useMemo, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { adminInputClass, adminLabelClass } from '@/components/admin/SlideOverForm';
import { useAdminStore } from '@/context/AdminStoreContext';
import {
  fulfillmentLabel,
  IN_STOCK_MAX_DAYS,
  IN_STOCK_MIN_DAYS,
  orderMaxPromisedDays,
} from '@/lib/stock';
import { FulfillmentType, OrderStatus } from '@/types';

const STATUS_FILTERS: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All Status' },
  { id: 'pending_payment', label: 'Pending' },
  { id: 'payment_submitted', label: 'Prepayment Paid' },
  { id: 'payment_verified', label: 'Verified' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'delivered', label: 'Delivered' },
];

const FULFILLMENT_FILTERS: { id: FulfillmentType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Types' },
  { id: 'in_stock', label: 'In Stock' },
  { id: 'pre_order', label: 'Pre-Order' },
  { id: 'mixed', label: 'Mixed' },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending_payment: 'payment_submitted',
  payment_submitted: 'payment_verified',
  payment_verified: 'in_progress',
  in_progress: 'delivered',
};

function FulfillmentBadge({ type }: { type: FulfillmentType }) {
  const styles: Record<FulfillmentType, string> = {
    in_stock: 'bg-[#52796F]/10 text-[#52796F]',
    pre_order: 'bg-[#B85D43]/10 text-[#B85D43]',
    mixed: 'bg-[#D4A373]/20 text-[#B85D43]',
  };
  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${styles[type]}`}
    >
      {fulfillmentLabel(type)}
    </span>
  );
}

function fulfillmentHint(type: FulfillmentType, maxDays: number): string {
  if (type === 'in_stock') {
    return `Ship in ${IN_STOCK_MIN_DAYS}–${IN_STOCK_MAX_DAYS} days after payment is verified`;
  }
  if (type === 'pre_order') {
    return `Make time about ${maxDays} days after deposit is verified`;
  }
  return `In-stock lines: ${IN_STOCK_MIN_DAYS}–${IN_STOCK_MAX_DAYS} days · Pre-order lines: up to ~${maxDays} days`;
}

export default function AdminOrdersPage() {
  const { orders, products, users, updateOrder } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<FulfillmentType | 'all'>('all');
  const [etaEdits, setEtaEdits] = useState<Record<string, string>>({});

  const experts = users.filter((u) => u.role === 'EXPERT');
  const userMap = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users]);
  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products]
  );

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (fulfillmentFilter !== 'all' && o.fulfillmentType !== fulfillmentFilter) return false;
    return true;
  });

  const counts = useMemo(() => {
    return {
      in_stock: orders.filter((o) => o.fulfillmentType === 'in_stock').length,
      pre_order: orders.filter((o) => o.fulfillmentType === 'pre_order').length,
      mixed: orders.filter((o) => o.fulfillmentType === 'mixed').length,
    };
  }, [orders]);

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="Filter by payment status and fulfillment type (in stock vs pre-order)."
      />

      <div className="space-y-3 mb-6">
        <div className="flex overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] min-w-max">
            {FULFILLMENT_FILTERS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFulfillmentFilter(s.id)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${
                  fulfillmentFilter === s.id
                    ? 'bg-[#2C302E] text-white'
                    : 'text-[#2C302E]/70 hover:bg-[#FDFBF7]'
                }`}
              >
                {s.label}
                {s.id !== 'all' && (
                  <span className="ml-1.5 opacity-70">
                    ({counts[s.id as keyof typeof counts]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] min-w-max">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${
                  statusFilter === s.id
                    ? 'bg-[#B85D43] text-white'
                    : 'text-[#2C302E]/70 hover:bg-[#FDFBF7]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-[28px] border border-[#EFEBE4] bg-[#EFEBE4]/40 p-12 text-center">
            <p className="font-serif text-2xl text-[#2C302E]">No orders in this filter.</p>
          </div>
        )}

        {filtered.map((order) => {
          const customer = userMap[order.userId];
          const next = NEXT_STATUS[order.status];
          const maxDays = orderMaxPromisedDays(order);
          const etaValue =
            etaEdits[order.id] ??
            (order.estimatedCompletionAt
              ? order.estimatedCompletionAt.slice(0, 10)
              : '');

          return (
            <div
              key={order.id}
              className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 hover:border-[#D4A373]/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-[#EFEBE4]">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest">
                    {order.id}
                  </p>
                  <p className="text-sm font-medium text-[#2C302E]/60 mt-1">
                    {customer?.fullName || 'Customer'} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <FulfillmentBadge type={order.fulfillmentType} />
                  <StatusBadge status={order.status} />
                </div>
              </div>

              <p className="text-xs font-medium text-[#2C302E]/55 mb-4">
                {fulfillmentHint(order.fulfillmentType, maxDays)}
              </p>

              <div className="space-y-2 mb-5">
                {order.items.map((item, idx) => {
                  const prod = productMap[item.productId];
                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm font-medium py-2 border-b border-[#EFEBE4]/60 last:border-0"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-[#2C302E]">
                          {prod?.name || item.productId}
                        </span>
                        <span className="text-[#2C302E]/50"> × {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-[10px] uppercase tracking-widest font-bold ${
                            item.fulfillment === 'in_stock'
                              ? 'text-[#52796F]'
                              : 'text-[#B85D43]'
                          }`}
                        >
                          {item.fulfillment === 'in_stock'
                            ? `In Stock · ${IN_STOCK_MIN_DAYS}–${IN_STOCK_MAX_DAYS} days`
                            : `Pre-Order · ~${item.promisedDays} days`}
                        </span>
                        <span className="font-mono font-bold">
                          ${((prod?.price || 0) * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="rounded-2xl bg-[#EFEBE4]/50 border border-[#EFEBE4] p-4">
                  <p className={adminLabelClass}>Payment (50% deposit)</p>
                  <p className="font-mono font-bold text-lg mt-1">
                    ${order.amountPaid} / ${order.totalPrice}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#EFEBE4]/50 border border-[#EFEBE4] p-4">
                  <label className={adminLabelClass}>Estimated Completion</label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="date"
                      className={adminInputClass}
                      value={etaValue}
                      onChange={(e) =>
                        setEtaEdits((prev) => ({ ...prev, [order.id]: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!etaValue) return;
                        updateOrder(order.id, {
                          estimatedCompletionAt: new Date(etaValue).toISOString(),
                        });
                      }}
                      className="px-3 py-2 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-widest font-bold shrink-0"
                    >
                      Save
                    </button>
                  </div>
                  <p className="text-[10px] font-medium text-[#2C302E]/45 mt-2">
                    Suggested wait: ~{maxDays} day{maxDays === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#EFEBE4]/50 border border-[#EFEBE4] p-4">
                  <label className={adminLabelClass}>
                    {order.fulfillmentType === 'in_stock'
                      ? 'Packing Expert'
                      : 'Making Expert'}
                  </label>
                  <select
                    className={`${adminInputClass} mt-2`}
                    value={order.assignedExpertId || ''}
                    onChange={(e) =>
                      updateOrder(order.id, {
                        assignedExpertId: e.target.value || null,
                      })
                    }
                  >
                    <option value="">Unassigned</option>
                    {experts.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.status === 'payment_submitted' && (
                  <button
                    type="button"
                    onClick={() => {
                      const eta = new Date();
                      eta.setDate(eta.getDate() + maxDays);
                      updateOrder(order.id, {
                        status: 'payment_verified',
                        estimatedCompletionAt: eta.toISOString(),
                      });
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#52796F] text-white text-[10px] uppercase tracking-widest font-bold"
                  >
                    Verify Payment
                    {order.fulfillmentType === 'in_stock'
                      ? ' · Ready to Ship'
                      : ' · Start Making'}
                  </button>
                )}
                {next && order.status !== 'payment_submitted' && (
                  <button
                    type="button"
                    onClick={() => updateOrder(order.id, { status: next })}
                    className="px-5 py-2.5 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold"
                  >
                    Move to {STATUS_FILTERS.find((s) => s.id === next)?.label || next}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
