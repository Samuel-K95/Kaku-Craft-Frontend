'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, Package, Clock, AlertTriangle, ShoppingBag, Loader2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { PeriodFilter, PeriodKey, getPeriodRange } from '@/components/admin/PeriodFilter';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { api } from '@/lib/api';
import { ApiOrder } from '@/types/orders';
import { ApiProduct } from '@/types/products';
import { OrderStatus } from '@/types';

export default function AdminOverviewPage() {
  const [period, setPeriod] = useState<PeriodKey>('1m');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const { data: orders = [], isLoading: ordersLoading } = useQuery<ApiOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: () => api.get<ApiOrder[]>('/orders/'),
    staleTime: 15 * 1000,
  });

  const { data: serverProducts = [], isLoading: productsLoading } = useQuery<ApiProduct[]>({
    queryKey: ['admin-products'],
    queryFn: () => api.get<ApiProduct[]>('/products/items/'),
    staleTime: 30 * 1000,
  });

  const { data: experts = [] } = useQuery({
    queryKey: ['admin-experts'],
    queryFn: () =>
      api.get<{ id: number }[]>('/users/manage/?role=expert'),
  });

  const { from, to } = getPeriodRange(period, customFrom, customTo);

  const filteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const dateStr = 'created_at' in o ? (o as ApiOrder).created_at : (o as { createdAt: string }).createdAt;
        const d = new Date(dateStr);
        return d >= from && d <= to;
      }),
    [orders, from, to]
  );

  const totalSales = filteredOrders.reduce((s, o) => {
    const val = 'total_price' in o ? parseFloat((o as ApiOrder).total_price) : (o as { totalPrice: number }).totalPrice;
    return s + (isNaN(val) ? 0 : val);
  }, 0);

  const deposits = filteredOrders.reduce((s, o) => {
    const val = 'amount_paid' in o ? parseFloat((o as ApiOrder).amount_paid) : (o as { amountPaid: number }).amountPaid;
    return s + (isNaN(val) ? 0 : val);
  }, 0);

  const activeOrdersCount = filteredOrders.filter((o) =>
    ['payment_verified', 'in_progress'].includes(o.status)
  ).length;

  // Determine low stock or out of stock items
  const lowStockItems = useMemo(() => {
    return serverProducts
      .filter((p) => p.status === 'out_of_stock' || !p.is_active)
      .map((p) => ({
        id: String(p.id),
        name: p.name,
        stockNote: p.status === 'out_of_stock' ? 'Out of stock' : 'Inactive',
      }));
  }, [serverProducts]);

  const activeProductsCount = serverProducts.filter(
    (p) => p.is_active && p.status === 'active'
  ).length;

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

  const isLoading = ordersLoading && productsLoading && orders.length === 0;

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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#B85D43]" />
        </div>
      ) : (
        <>
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
              hint="Prepayments collected"
              icon={ShoppingBag}
            />
            <StatCard
              label="Active Orders"
              value={String(activeOrdersCount)}
              hint="Verified or in progress"
              icon={Clock}
            />
            <StatCard
              label="Low / Out of Stock"
              value={String(lowStockItems.length)}
              hint="Requires replenishment"
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
                      <StatusBadge status={status as OrderStatus} />
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
                {experts.length} experts · {activeProductsCount} active products
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
                {needsAttention.map((order) => {
                  const orderId = order.id;
                  const paid = 'amount_paid' in order ? order.amount_paid : (order as { amountPaid: number }).amountPaid;
                  const total = 'total_price' in order ? order.total_price : (order as { totalPrice: number }).totalPrice;

                  return (
                    <div
                      key={orderId}
                      className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#EFEBE4]/50 border border-[#EFEBE4]"
                    >
                      <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-widest">
                          #{orderId}
                        </p>
                        <p className="text-xs font-medium text-[#2C302E]/50 mt-1">
                          ${paid} paid of ${total}
                        </p>
                      </div>
                      <StatusBadge status={order.status as OrderStatus} />
                    </div>
                  );
                })}
              </div>

              {lowStockItems.length > 0 && (
                <div className="pt-4 border-t border-[#EFEBE4] space-y-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#D4A373]">
                    Attention / Low Stock
                  </p>
                  {lowStockItems.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm font-medium">
                      <span className="truncate pr-3">{p.name}</span>
                      <span className="font-mono font-bold text-[#B85D43]">{p.stockNote}</span>
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
        </>
      )}
    </div>
  );
}
