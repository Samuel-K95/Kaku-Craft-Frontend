'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Eye, FileText, AlertCircle, Clock, CheckCircle2, Scissors } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { adminInputClass, adminLabelClass } from '@/components/admin/SlideOverForm';
import { api, normalizeError } from '@/lib/api';
import { ApiOrder, ApiPaymentProof } from '@/types/orders';
import {
  fulfillmentLabel,
  IN_STOCK_MAX_DAYS,
  IN_STOCK_MIN_DAYS,
} from '@/lib/stock';
import { FulfillmentType, OrderStatus } from '@/types';

const STATUS_FILTERS: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All Status' },
  { id: 'pending_payment', label: 'Pending Payment' },
  { id: 'payment_submitted', label: 'Payment Submitted' },
  { id: 'payment_verified', label: 'Verified' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'completed', label: 'Completed' },
];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [reviewProof, setReviewProof] = useState<{ order: ApiOrder; proof: ApiPaymentProof } | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const { data: orders = [], isLoading } = useQuery<ApiOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: () => api.get<ApiOrder[]>('/orders/'),
    staleTime: 15 * 1000,
  });

  const { data: experts = [] } = useQuery({
    queryKey: ['admin-experts'],
    queryFn: () => api.get<{ id: number; full_name: string; role: string }[]>('/users/manage/?role=expert'),
  });

  const assignMutation = useMutation({
    mutationFn: (vars: { orderId: number; expertId: number }) =>
      api.post(`/orders/${vars.orderId}/assign-expert/`, { expert_id: vars.expertId }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  // Approve / Reject Proof Mutation
  const reviewMutation = useMutation({
    mutationFn: (vars: { proofId: number; approve: boolean; adminNote: string }) =>
      api.post(`/orders/payment-proofs/${vars.proofId}/review/`, {
        approve: vars.approve,
        admin_note: vars.adminNote,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setReviewProof(null);
      setAdminNote('');
    },
  });

  // Manual Status Transition Mutation
  const statusMutation = useMutation({
    mutationFn: (vars: { orderId: number; status: string }) =>
      api.post(`/orders/${vars.orderId}/status/`, {
        status: vars.status,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    return true;
  });

  const handleReviewDecision = async (approve: boolean) => {
    if (!reviewProof) return;
    setReviewLoading(true);
    setReviewError('');

    try {
      await reviewMutation.mutateAsync({
        proofId: reviewProof.proof.id,
        approve,
        adminNote,
      });
    } catch (err) {
      setReviewError(normalizeError(err));
    } finally {
      setReviewLoading(false);
    }
  };

  const handleNextStatus = (order: ApiOrder) => {
    let nextStatus = '';
    if (order.status === 'payment_verified' && order.has_minimum_deposit) {
      nextStatus = 'in_progress';
    } else if (order.status === 'in_progress') {
      nextStatus = 'delivered';
    } else if (order.status === 'delivered' && order.is_fully_paid) {
      nextStatus = 'completed';
    }

    if (nextStatus) {
      void statusMutation.mutateAsync({ orderId: order.id, status: nextStatus });
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Orders Desk"
        description="Review customer payment proofs, approve deposits, and track production status."
      />

      {/* Filter Tabs */}
      <div className="space-y-3 mb-6">
        <div className="flex overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] min-w-max">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors ${
                  statusFilter === s.id
                    ? 'bg-[#B85D43] text-white shadow-sm'
                    : 'text-[#2C302E]/70 hover:bg-[#FDFBF7]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-[#2C302E]/60 animate-pulse mb-4">Syncing live orders...</p>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-[28px] border border-[#EFEBE4] bg-[#EFEBE4]/40 p-12 text-center">
            <p className="font-serif text-2xl text-[#2C302E]">No orders in this status.</p>
          </div>
        )}

        {filtered.map((order) => {
          const pendingProof = order.payment_proofs?.find((p) => p.status === 'pending');

          return (
            <div
              key={order.id}
              className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 hover:border-[#D4A373]/50 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-[#EFEBE4]">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#B85D43]">
                    #ORD-KAKU-{order.id}
                  </p>
                  <p className="text-sm font-medium text-[#2C302E]/60 mt-1">
                    {order.shipping_address || 'Customer Order'} ·{' '}
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={order.status as OrderStatus} />
                </div>
              </div>

              <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50">
                  Assign expert
                </label>
                <select
                  className={`${adminInputClass} max-w-xs`}
                  value={order.assigned_expert ?? ''}
                  onChange={(e) => {
                    const expertId = Number(e.target.value);
                    if (!expertId) return;
                    assignMutation.mutate({ orderId: order.id, expertId });
                  }}
                >
                  <option value="">
                    {order.assigned_expert_name
                      ? `Current: ${order.assigned_expert_name}`
                      : 'Select expert…'}
                  </option>
                  {experts.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Items */}
              <div className="space-y-2 mb-5">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm font-medium py-2 border-b border-[#EFEBE4]/60 last:border-0"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-[#2C302E]">{item.product_name}</span>
                      <span className="text-[#2C302E]/50"> × {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold">
                        ${parseFloat(item.line_total || '0').toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="rounded-2xl bg-[#EFEBE4]/50 border border-[#EFEBE4] p-4">
                  <p className={adminLabelClass}>Total Price</p>
                  <p className="font-mono font-bold text-lg mt-1 text-[#2C302E]">
                    ${parseFloat(order.total_price || '0').toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#EFEBE4]/50 border border-[#EFEBE4] p-4">
                  <p className={adminLabelClass}>Amount Paid</p>
                  <p className="font-mono font-bold text-lg mt-1 text-[#52796F]">
                    ${parseFloat(order.amount_paid || '0').toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#EFEBE4]/50 border border-[#EFEBE4] p-4">
                  <p className={adminLabelClass}>Remaining Balance</p>
                  <p className="font-mono font-bold text-lg mt-1 text-[#B85D43]">
                    ${parseFloat(order.remaining_amount || '0').toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Actions & Proof Review */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {pendingProof && (
                  <button
                    type="button"
                    onClick={() => setReviewProof({ order, proof: pendingProof })}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#9c4d37] transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Review Pending Proof (${parseFloat(pendingProof.amount).toFixed(2)})
                  </button>
                )}

                {order.status === 'payment_verified' && order.has_minimum_deposit && (
                  <button
                    type="button"
                    onClick={() => handleNextStatus(order)}
                    className="px-5 py-2.5 rounded-full bg-[#52796F] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#43645c] transition-colors"
                  >
                    Start Production (Deposit Verified)
                  </button>
                )}

                {order.status === 'in_progress' && (
                  <button
                    type="button"
                    onClick={() => handleNextStatus(order)}
                    className="px-5 py-2.5 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#1a1c1b] transition-colors"
                  >
                    Mark Delivered
                  </button>
                )}

                {order.status === 'delivered' && order.is_fully_paid && (
                  <button
                    type="button"
                    onClick={() => handleNextStatus(order)}
                    className="px-5 py-2.5 rounded-full bg-[#52796F] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#43645c] transition-colors"
                  >
                    Complete Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAYMENT PROOF REVIEW MODAL */}
      {reviewProof && (
        <div className="fixed inset-0 bg-[#2C302E]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-[32px] max-w-lg w-full p-8 border border-[#EFEBE4] shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
              <div>
                <h3 className="font-serif text-2xl text-[#2C302E]">Verify Payment Receipt</h3>
                <p className="text-xs font-mono text-[#2C302E]/50 mt-1">
                  Order #{reviewProof.order.id} · Proof #{reviewProof.proof.id}
                </p>
              </div>
              <button
                onClick={() => setReviewProof(null)}
                className="p-2 hover:bg-[#EFEBE4] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#2C302E]" />
              </button>
            </div>

            {reviewError && (
              <div className="rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-4 py-3 text-xs font-bold text-[#B85D43]">
                {reviewError}
              </div>
            )}

            {/* Receipt Image Display */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#EFEBE4] border border-[#2C302E]/10">
              {reviewProof.proof.image ? (
                <Image
                  src={reviewProof.proof.image}
                  alt="Customer Payment Receipt"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#2C302E]/40">
                  No Receipt Image
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[#2C302E]/60">Claimed Amount:</span>
                <span className="font-bold text-[#B85D43]">
                  ${parseFloat(reviewProof.proof.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[#2C302E]/60">Payment Kind:</span>
                <span className="font-bold capitalize text-[#2C302E]">
                  {reviewProof.proof.kind}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">
                Admin Note (Optional)
              </label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Verified transaction reference CBE-109283"
                className="w-full bg-[#EFEBE4]/50 border border-[#EFEBE4] rounded-2xl px-5 py-3 text-sm outline-none focus:border-[#B85D43]/40"
              />
            </div>

            {/* Decision Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                disabled={reviewLoading}
                onClick={() => handleReviewDecision(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#52796F] text-white py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#43645c] transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {reviewLoading ? 'Processing...' : 'Approve Proof'}
              </button>
              <button
                type="button"
                disabled={reviewLoading}
                onClick={() => handleReviewDecision(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#B85D43] text-white py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#9c4d37] transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Reject Proof
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
