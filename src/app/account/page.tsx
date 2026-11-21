'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  MessageCircle,
  LogOut,
  UploadCloud,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Scissors,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, normalizeError } from '@/lib/api';
import { ApiCustomOrder, ApiOrder, ApiPaymentProof } from '@/types/orders';
import { ApiTelegramLink } from '@/types/notifications';
import { Send } from 'lucide-react';

type TabView = 'orders' | 'custom' | 'profile';

export default function AccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading, logout, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabView>('orders');

  // Proof Upload Modal State
  const [proofModalOrder, setProofModalOrder] = useState<ApiOrder | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofAmount, setProofAmount] = useState('');
  const [proofLoading, setProofLoading] = useState(false);
  const [proofError, setProofError] = useState('');

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Telegram Notifications Link State
  const { data: telegramLink, refetch: refetchTelegram } = useQuery<ApiTelegramLink>({
    queryKey: ['telegram-link'],
    queryFn: () => api.get<ApiTelegramLink>('/notifications/telegram/link/'),
    enabled: isAuthenticated,
  });

  const disconnectTelegramMutation = useMutation({
    mutationFn: () => api.delete<ApiTelegramLink>('/notifications/telegram/link/'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-link'] });
    },
  });
  const [passwordError, setPasswordError] = useState('');

  // Queries for live standard and custom orders
  const { data: myOrders = [], isLoading: ordersLoading } = useQuery<ApiOrder[]>({
    queryKey: ['orders'],
    queryFn: () => api.get<ApiOrder[]>('/orders/'),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  const { data: myCustom = [], isLoading: customLoading } = useQuery<ApiCustomOrder[]>({
    queryKey: ['custom-orders'],
    queryFn: () => api.get<ApiCustomOrder[]>('/orders/custom/'),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  // Custom Order Confirm Quote Mutation
  const confirmQuoteMutation = useMutation({
    mutationFn: (orderId: number) => api.post(`/orders/custom/${orderId}/confirm/`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['custom-orders'] });
    },
  });

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending_payment':
      case 'awaiting_payment':
      case 'pending_review':
        return { label: 'Waiting for Deposit', icon: Clock, color: 'text-[#B85D43]', bg: 'bg-[#B85D43]/10' };
      case 'payment_submitted':
        return { label: 'Checking Payment', icon: AlertCircle, color: 'text-[#52796F]', bg: 'bg-[#52796F]/10' };
      case 'payment_verified':
      case 'approved':
        return { label: 'Payment Confirmed', icon: CheckCircle2, color: 'text-[#52796F]', bg: 'bg-[#52796F]/10' };
      case 'in_progress':
      case 'in_production':
        return { label: 'Being Made', icon: Scissors, color: 'text-[#D4A373]', bg: 'bg-[#D4A373]/15' };
      case 'delivered':
        return { label: 'Delivered', icon: CheckCircle2, color: 'text-[#52796F]', bg: 'bg-[#52796F]/10' };
      case 'completed':
        return { label: 'Completed', icon: CheckCircle2, color: 'text-[#52796F]', bg: 'bg-[#52796F]/10' };
      case 'rejected':
      case 'cancelled':
        return { label: 'Cancelled', icon: X, color: 'text-[#2C302E]/50', bg: 'bg-[#2C302E]/5' };
      default:
        return { label: status.replace('_', ' '), icon: Clock, color: 'text-[#2C302E]/60', bg: 'bg-[#EFEBE4]' };
    }
  };

  const handleOpenProofModal = (order: ApiOrder) => {
    setProofModalOrder(order);
    const needed = order.status === 'delivered' ? order.remaining_amount : order.deposit_required;
    setProofAmount(needed || '0');
    setProofFile(null);
    setProofError('');
  };

  const handleSubmitProof = async () => {
    if (!proofModalOrder || !proofFile) {
      setProofError('Please choose a screenshot or photo of your payment receipt.');
      return;
    }

    setProofLoading(true);
    setProofError('');

    try {
      const formData = new FormData();
      formData.append('image', proofFile);
      formData.append('amount', proofAmount);
      formData.append(
        'kind',
        proofModalOrder.status === 'delivered' ? 'remaining' : 'deposit'
      );

      await api.upload<ApiPaymentProof>(
        `/orders/${proofModalOrder.id}/payment-proofs/`,
        formData
      );

      setProofModalOrder(null);
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (err) {
      setProofError(normalizeError(err));
    } finally {
      setProofLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileMsg('');

    try {
      const formData = new FormData();
      if (editName.trim()) {
        formData.append('full_name', editName.trim());
      }
      if (avatarFile) {
        formData.append('profile_picture', avatarFile);
      }

      await api.patch('/users/profile/edit/', formData);
      await refreshProfile();
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileError(normalizeError(err));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMsg('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    try {
      await api.post('/users/profile/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordMsg('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(normalizeError(err));
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <p className="font-serif text-lg text-[#2C302E]/60 animate-pulse">Loading Account...</p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 px-4 select-none">
        <h1 className="font-serif text-4xl text-[#2C302E]">Sign In Required</h1>
        <p className="text-sm text-[#2C302E]/60 max-w-sm">
          Please sign in to view your orders, track craft progress, and manage your account.
        </p>
        <div className="pt-2 flex gap-4">
          <Link
            href="/signin"
            className="bg-[#2C302E] text-white px-8 py-3.5 rounded-full font-serif text-xs uppercase tracking-widest hover:bg-[#B85D43] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="border border-[#2C302E]/20 text-[#2C302E] px-8 py-3.5 rounded-full font-serif text-xs uppercase tracking-widest hover:bg-[#EFEBE4] transition-colors"
          >
            Create Account
          </Link>
        </div>
      </main>
    );
  }

  const tabs: { id: TabView; label: string; icon: typeof Package }[] = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'custom', label: 'Custom Orders', icon: MessageCircle },
    { id: 'profile', label: 'My Profile', icon: Settings },
  ];

  return (
    <main className="relative min-h-screen py-16 px-4 md:px-8 lg:px-12 bg-[#FDFBF7]/70 backdrop-blur-sm text-[#2C302E] select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs uppercase font-bold tracking-[0.3em] text-[#D4A373] bg-[#EFEBE4]/80 backdrop-blur-md px-5 py-2 rounded-full border border-[#EFEBE4]">
            <span>Client Portal</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C302E] leading-none tracking-tight">
            Hello, <span className="italic font-normal text-[#B85D43]">{user.fullName.split(' ')[0]}.</span>
          </h1>
          <p className="text-sm text-[#2C302E]/70 font-medium max-w-lg">
            Track your artisanal crochet orders, deposit reviews, and account details.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-[#EFEBE4]/50 p-6 rounded-[28px] border border-[#EFEBE4] backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4A373]/40 shadow-sm bg-[#EFEBE4]">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt={user.fullName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-xl text-[#2C302E] font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-xl text-[#2C302E] font-bold truncate">{user.fullName}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-full text-left transition-all duration-300 ${
                        isActive
                          ? 'bg-[#B85D43] text-white shadow-sm'
                          : 'text-[#2C302E]/70 hover:bg-[#FDFBF7] hover:text-[#2C302E]'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs uppercase tracking-widest font-bold">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-[#2C302E]/10">
                <button
                  onClick={() => {
                    logout();
                    router.push('/signin');
                  }}
                  className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-full text-[#2C302E]/50 hover:text-[#B85D43] hover:bg-[#FDFBF7] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest font-bold">Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1 min-w-0">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl text-[#2C302E]">My Orders</h2>
                  <p className="text-sm font-medium text-[#2C302E]/60 mt-1">
                    Live updates on deposits, making, and delivery.
                  </p>
                </div>

                {ordersLoading ? (
                  <p className="text-sm text-[#2C302E]/60 animate-pulse">Loading orders...</p>
                ) : myOrders.length === 0 ? (
                  <div className="rounded-[28px] border border-[#EFEBE4] bg-[#EFEBE4]/40 p-12 text-center space-y-4">
                    <p className="font-serif text-2xl text-[#2C302E]">No orders yet.</p>
                    <p className="text-sm font-medium text-[#2C302E]/60">Browse the collection to find pieces you love.</p>
                    <Link
                      href="/shop"
                      className="inline-block mt-2 bg-[#2C302E] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#B85D43] transition-colors"
                    >
                      Go to Shop
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {myOrders.map((order) => {
                      const status = getStatusDisplay(order.status);

                      return (
                        <div
                          key={order.id}
                          className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 hover:border-[#D4A373]/60 hover:shadow-[0_20px_40px_rgba(212,163,115,0.1)] transition-all duration-500"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#EFEBE4]">
                            <div>
                              <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#B85D43]">
                                #ORD-KAKU-{order.id}
                              </p>
                              <p className="text-xs font-medium text-[#2C302E]/50 mt-1">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                              <div
                                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}
                              >
                                <status.icon className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold tracking-widest uppercase">{status.label}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between py-1 border-b border-[#EFEBE4]/50 last:border-none">
                                <div className="min-w-0">
                                  <h4 className="font-serif text-lg font-bold text-[#2C302E] truncate">
                                    {item.product_name}
                                  </h4>
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50">
                                    Qty: {item.quantity} · ${parseFloat(item.unit_price).toFixed(2)} each
                                  </p>
                                </div>
                                <p className="font-mono text-sm font-bold text-[#2C302E]">
                                  ${parseFloat(item.line_total).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 pt-5 border-t border-[#EFEBE4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            <div className="font-mono text-sm font-bold">
                              <span className="text-[#2C302E]/50 font-medium">Total </span>
                              <span className="text-[#2C302E]">${parseFloat(order.total_price).toFixed(2)}</span>
                              <span className="mx-2 text-[#EFEBE4]">·</span>
                              <span className="text-[#2C302E]/50 font-medium">Paid </span>
                              <span className="text-[#B85D43]">${parseFloat(order.amount_paid).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              {order.status === 'pending_payment' && (
                                <button
                                  onClick={() => handleOpenProofModal(order)}
                                  className="bg-[#B85D43] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#9c4d37] transition-colors"
                                >
                                  Upload 50% Deposit Proof
                                </button>
                              )}

                              {order.status === 'delivered' && !order.is_fully_paid && (
                                <button
                                  onClick={() => handleOpenProofModal(order)}
                                  className="bg-[#52796F] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#43645c] transition-colors"
                                >
                                  Upload Final Payment Proof
                                </button>
                              )}

                              <Link
                                href="/contact"
                                className="inline-flex items-center justify-center space-x-2 border border-[#2C302E]/15 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#EFEBE4] transition-colors text-[#2C302E]"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Support</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CUSTOM ORDERS TAB */}
            {activeTab === 'custom' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl text-[#2C302E]">Custom Bespoke Orders</h2>
                    <p className="text-sm font-medium text-[#2C302E]/60 mt-1">
                      Made-to-order crochet pieces from your sketches and references.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-block bg-[#2C302E] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#B85D43] transition-colors text-center"
                  >
                    Request Custom Piece
                  </Link>
                </div>

                {customLoading ? (
                  <p className="text-sm text-[#2C302E]/60 animate-pulse">Loading bespoke orders...</p>
                ) : myCustom.length === 0 ? (
                  <div className="rounded-[28px] border border-[#EFEBE4] bg-[#EFEBE4]/40 p-12 text-center space-y-4">
                    <p className="font-serif text-2xl text-[#2C302E]">No custom requests yet.</p>
                    <p className="text-sm font-medium text-[#2C302E]/60">
                      Send us your vision or photo, and our Addis Ababa artisan will quote and make it.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-block mt-2 bg-[#B85D43] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#9c4d37] transition-colors"
                    >
                      Start a Custom Piece
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {myCustom.map((order) => {
                      const status = getStatusDisplay(order.status);

                      return (
                        <div
                          key={order.id}
                          className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] overflow-hidden hover:border-[#D4A373]/60 hover:shadow-[0_20px_40px_rgba(212,163,115,0.1)] transition-all duration-500"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-5">
                            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[220px] md:col-span-2 bg-[#EFEBE4]">
                              {order.reference_image ? (
                                <Image
                                  src={order.reference_image}
                                  alt="Reference"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#2C302E]/40 uppercase tracking-widest">
                                  No Image Provided
                                </div>
                              )}
                              <div className="absolute top-4 left-4 bg-[#FDFBF7]/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#B85D43]">
                                Custom Piece #{order.id}
                              </div>
                            </div>

                            <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                              <div>
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                  <div
                                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}
                                  >
                                    <status.icon className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold tracking-widest uppercase">
                                      {status.label}
                                    </span>
                                  </div>
                                </div>

                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#D4A373] mb-2">
                                  Your Vision & Details
                                </h4>
                                <p className="font-serif text-lg leading-relaxed text-[#2C302E] font-medium">
                                  {order.description}
                                </p>

                                {order.quoted_price && (
                                  <div className="mt-5 inline-block bg-[#EFEBE4]/70 px-5 py-3 rounded-2xl border border-[#EFEBE4]">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mb-1">
                                      Quoted Price
                                    </p>
                                    <p className="font-mono font-bold text-xl text-[#2C302E]">
                                      ${parseFloat(order.quoted_price).toFixed(2)}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                {order.status === 'approved' && !order.customer_confirmed && (
                                  <button
                                    onClick={() => confirmQuoteMutation.mutate(order.id)}
                                    className="bg-[#B85D43] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#9c4d37] transition-colors"
                                  >
                                    Accept & Confirm Quote
                                  </button>
                                )}
                                <Link
                                  href="/contact"
                                  className="inline-flex items-center space-x-2 border border-[#2C302E]/15 text-[#2C302E] px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#EFEBE4] transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Discuss Order</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl text-[#2C302E]">My Profile</h2>
                  <p className="text-sm font-medium text-[#2C302E]/60 mt-1">
                    Update your account details and password.
                  </p>
                </div>

                {profileMsg && (
                  <div className="rounded-2xl bg-[#52796F]/10 border border-[#52796F]/20 px-5 py-3 text-xs font-bold text-[#52796F]">
                    {profileMsg}
                  </div>
                )}
                {profileError && (
                  <div className="rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-5 py-3 text-xs font-bold text-[#B85D43]">
                    {profileError}
                  </div>
                )}

                <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 space-y-6">
                  <div className="pb-5 border-b border-[#EFEBE4]">
                    <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#2C302E]">
                      Personal Details
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleUpdateProfile}>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4A373]/40 shadow-sm shrink-0 bg-[#EFEBE4]">
                        {user.avatarUrl ? (
                          <Image src={user.avatarUrl} alt="Avatar" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-[#2C302E]">
                            {user.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer inline-flex items-center space-x-2 border border-[#2C302E]/15 text-[#2C302E] px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#EFEBE4] transition-colors">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setAvatarFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      {avatarFile && <span className="text-xs font-mono text-[#52796F]">{avatarFile.name}</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.fullName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-[#EFEBE4]/40 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#D4A373] transition-colors font-serif text-lg font-medium text-[#2C302E]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                          Email (Read-only)
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full bg-[#EFEBE4]/60 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 text-[#2C302E]/50 font-mono text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="bg-[#2C302E] text-white px-8 py-3.5 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#B85D43] transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password card */}
                {passwordMsg && (
                  <div className="rounded-2xl bg-[#52796F]/10 border border-[#52796F]/20 px-5 py-3 text-xs font-bold text-[#52796F]">
                    {passwordMsg}
                  </div>
                )}
                {passwordError && (
                  <div className="rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-5 py-3 text-xs font-bold text-[#B85D43]">
                    {passwordError}
                  </div>
                )}

                <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 space-y-5">
                  <div className="pb-5 border-b border-[#EFEBE4]">
                    <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#2C302E]">
                      Change Password
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={handleChangePassword}>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Current password"
                        className="w-full bg-[#EFEBE4]/40 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#D4A373] transition-colors text-sm font-medium text-[#2C302E]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                          New Password (min 8 chars)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          className="w-full bg-[#EFEBE4]/40 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#D4A373] transition-colors text-sm font-medium text-[#2C302E]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full bg-[#EFEBE4]/40 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#D4A373] transition-colors text-sm font-medium text-[#2C302E]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="bg-[#B85D43] text-white px-8 py-3.5 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#9c4d37] transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* TELEGRAM NOTIFICATIONS CARD */}
                <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-5 border-b border-[#EFEBE4]">
                    <div>
                      <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#2C302E]">
                        Telegram Instant Alerts
                      </p>
                      <p className="text-xs font-medium text-[#2C302E]/60 mt-1">
                        Receive instant push notifications on your phone whenever your order deposit is verified or custom quote is ready.
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center shrink-0">
                      <Send className="w-5 h-5" />
                    </div>
                  </div>

                  {telegramLink?.is_active ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#52796F]/10 border border-[#52796F]/20 text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-[#52796F] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Connected to Telegram Bot (@{telegramLink.bot_username})
                        </p>
                        <p className="text-[11px] text-[#2C302E]/60">
                          Active · Order progress alerts will be sent directly to your Telegram.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => disconnectTelegramMutation.mutate()}
                        disabled={disconnectTelegramMutation.isPending}
                        className="px-4 py-2 rounded-full border border-[#B85D43]/30 text-[#B85D43] text-[10px] font-bold tracking-widest uppercase hover:bg-[#B85D43] hover:text-white transition-colors shrink-0"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#EFEBE4]/60 border border-[#EFEBE4]">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#2C302E]">Connect Telegram Notifications</p>
                        <p className="text-[11px] text-[#2C302E]/60">
                          Tap below to open Telegram and start @{telegramLink?.bot_username || 'KakuCraftBot'}.
                        </p>
                      </div>
                      {telegramLink?.deep_link ? (
                        <a
                          href={telegramLink.deep_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#229ED9] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#1E8BC3] transition-colors shadow-sm shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Open in Telegram</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-6 py-3 rounded-full bg-[#2C302E]/20 text-white text-[10px] font-bold uppercase tracking-widest"
                        >
                          Loading link...
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* PAYMENT PROOF UPLOAD MODAL */}
      {proofModalOrder && (
        <div className="fixed inset-0 bg-[#2C302E]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-[32px] max-w-md w-full p-8 border border-[#EFEBE4] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
              <h3 className="font-serif text-2xl text-[#2C302E]">Upload Payment Proof</h3>
              <button
                onClick={() => setProofModalOrder(null)}
                className="p-2 hover:bg-[#EFEBE4] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#2C302E]" />
              </button>
            </div>

            {proofError && (
              <div className="rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-4 py-3 text-xs font-bold text-[#B85D43]">
                {proofError}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">
                Order #{proofModalOrder.id}
              </p>
              <p className="font-mono text-2xl text-[#B85D43] font-bold">
                ${parseFloat(proofAmount).toFixed(2)}
              </p>
              <p className="text-xs text-[#2C302E]/60">
                Commercial Bank of Ethiopia · Acct 100028394857 (Kaku Craft Studio)
              </p>
            </div>

            <div className="relative border-2 border-dashed border-[#2C302E]/20 rounded-2xl p-6 text-center hover:bg-[#EFEBE4]/40 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProofFile(e.target.files[0]);
                  }
                }}
              />
              {proofFile ? (
                <div className="space-y-1">
                  <Check className="w-8 h-8 text-green-600 mx-auto" />
                  <p className="font-mono text-xs text-[#2C302E] font-bold truncate">{proofFile.name}</p>
                  <p className="text-[10px] text-[#2C302E]/40">Click to change</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="w-8 h-8 text-[#2C302E]/40 mx-auto" />
                  <p className="text-xs font-medium text-[#2C302E]">Select screenshot or receipt photo</p>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmitProof}
              disabled={!proofFile || proofLoading}
              className="w-full bg-[#B85D43] text-white py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#9c4d37] transition-colors disabled:opacity-50"
            >
              {proofLoading ? 'Uploading...' : 'Submit for Review'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
