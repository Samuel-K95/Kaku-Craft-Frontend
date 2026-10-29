'use client';

import React, { useMemo, useState } from 'react';
import { DollarSign, Package, Clock, AlertTriangle, ShoppingBag } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { PeriodFilter, PeriodKey, getPeriodRange } from '@/components/admin/PeriodFilter';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useAdminStore } from '@/context/AdminStoreContext';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { orders, products, users } = useAdminStore();
  const [period, setPeriod] = useState<PeriodKey>('1m');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const { from, to } = getPeriodRange(period, customFrom, customTo);

  const filteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d >= from && d <= to;
      }),
    [orders, from, to]
  );

  const totalSales = filteredOrders.reduce((s, o) => s + o.totalPrice, 0);
  const deposits = filteredOrders.reduce((s, o) => s + o.amountPaid, 0);
  const activeCustomish = filteredOrders.filter((o) =>
    ['payment_verified', 'in_progress'].includes(o.status)
  ).length;
  const lowStock = products.filter((p) => p.active && p.stock <= 3);

  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return map;
  }, [filteredOrders]);

  const maxStatus = Math.max(1, ...Object.values(statusBreakdown));
  const needsAttention = orders.filter((o) =>
    ['pending_payment', 'payment_submitted'].includes(o.status)
  );

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="Platform activity across a customizable time period."
        actions={
          <PeriodFilter
            value={period}
            onChange={setPeriod}
            customFrom={customFrom}
            customTo={customTo}
            onCustomFromChange={setCustomFrom}
            onCustomToChange={setCustomTo}
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Sales"
          value={`$${totalSales.toFixed(0)}`}
          hint={`${filteredOrders.length} orders in period`}
          icon={DollarSign}
        />
        <StatCard
          label="Deposits Received"
          value={`$${deposits.toFixed(0)}`}
          hint="50% prepayments collected"
          icon={ShoppingBag}
        />
        <StatCard
          label="Active Orders"
          value={String(activeCustomish)}
          hint="Verified or in progress"
          icon={Clock}
        />
        <StatCard
          label="Low Stock"
          value={String(lowStock.length)}
          hint="3 or fewer left"
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8">
          <h3 className="font-serif text-2xl text-[#2C302E] mb-6">Orders by Status</h3>
          <div className="space-y-4">
            {Object.keys(statusBreakdown).length === 0 && (
              <p className="text-sm font-medium text-[#2C302E]/50">No orders in this period.</p>
            )}
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={status as never} />
                  <span className="font-mono text-sm font-bold text-[#2C302E]">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-[#EFEBE4] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#B85D43]"
                    style={{ width: `${(count / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs font-medium text-[#2C302E]/50">
            {users.filter((u) => u.role === 'EXPERT').length} experts ·{' '}
            {products.filter((p) => p.active).length} active products
          </p>
        </div>

        <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-[#2C302E]">Needs Attention</h3>
            <AlertTriangle className="w-5 h-5 text-[#B85D43]" />
          </div>

          <div className="space-y-3">
            {needsAttention.length === 0 && (
              <p className="text-sm font-medium text-[#2C302E]/50">All clear for now.</p>
            )}
            {needsAttention.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#EFEBE4]/50 border border-[#EFEBE4]"
              >
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest">
                    {order.id}
                  </p>
                  <p className="text-xs font-medium text-[#2C302E]/50 mt-1">
                    ${order.amountPaid} paid of ${order.totalPrice}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>

          {lowStock.length > 0 && (
            <div className="pt-4 border-t border-[#EFEBE4] space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#D4A373]">
                Low Stock Items
              </p>
              {lowStock.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm font-medium">
                  <span className="truncate pr-3">{p.name}</span>
                  <span className="font-mono font-bold text-[#B85D43]">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/admin/orders"
            className="inline-flex text-[10px] uppercase tracking-widest font-bold text-[#B85D43] hover:underline"
          >
            Open Orders →
          </Link>
        </div>
      </div>
    </div>
  );
}
