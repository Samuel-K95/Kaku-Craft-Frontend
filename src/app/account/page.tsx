'use client';

import React, { useState } from 'react';
import { MOCK_USERS, MOCK_ORDERS, MOCK_CUSTOM_ORDERS } from '@/data/mockStore';
import { PRODUCTS } from '@/data/products';
import Image from 'next/image';
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
} from 'lucide-react';
import Link from 'next/link';
import { OrderStatus } from '@/types';

type TabView = 'orders' | 'custom' | 'profile';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabView>('orders');

  const user = MOCK_USERS[0];
  const myOrders = MOCK_ORDERS.filter((o) => o.userId === user.id);
  const myCustom = MOCK_CUSTOM_ORDERS.filter((o) => o.userId === user.id);

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return { label: 'Waiting for Deposit', icon: Clock, color: 'text-[#B85D43]', bg: 'bg-[#B85D43]/10' };
      case 'payment_submitted':
        return { label: 'Checking Payment', icon: AlertCircle, color: 'text-[#52796F]', bg: 'bg-[#52796F]/10' };
      case 'payment_verified':
        return { label: 'Payment Confirmed', icon: CheckCircle2, color: 'text-[#52796F]', bg: 'bg-[#52796F]/10' };
      case 'in_progress':
        return { label: 'Being Made', icon: Scissors, color: 'text-[#D4A373]', bg: 'bg-[#D4A373]/15' };
      case 'delivered':
        return { label: 'Delivered', icon: CheckCircle2, color: 'text-[#52796F]', bg: 'bg-[#52796F]/10' };
      case 'completed':
        return { label: 'Completed', icon: CheckCircle2, color: 'text-[#52796F]', bg: 'bg-[#52796F]/10' };
      case 'cancelled':
        return { label: 'Cancelled', icon: X, color: 'text-[#2C302E]/50', bg: 'bg-[#2C302E]/5' };
      default:
        return { label: status, icon: Clock, color: 'text-[#2C302E]/60', bg: 'bg-[#EFEBE4]' };
    }
  };

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
            <span>Your Account</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C302E] leading-none tracking-tight">
            Hello, <span className="italic font-normal text-[#B85D43]">{user.fullName.split(' ')[0]}.</span>
          </h1>
          <p className="text-sm text-[#2C302E]/70 font-medium max-w-lg">
            Track your orders, custom requests, and account details in one place.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-[#EFEBE4]/50 p-6 rounded-[28px] border border-[#EFEBE4] backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4A373]/40 shadow-sm">
                  <Image src={user.avatarUrl!} alt={user.fullName} fill className="object-cover" />
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
                <button className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-full text-[#2C302E]/50 hover:text-[#B85D43] hover:bg-[#FDFBF7] transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest font-bold">Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="flex-1 min-w-0">
            {/* ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl text-[#2C302E]">My Orders</h2>
                  <p className="text-sm font-medium text-[#2C302E]/60 mt-1">
                    See the status of your handmade items.
                  </p>
                </div>

                {myOrders.length === 0 ? (
                  <div className="rounded-[28px] border border-[#EFEBE4] bg-[#EFEBE4]/40 p-12 text-center space-y-4">
                    <p className="font-serif text-2xl text-[#2C302E]">No orders yet.</p>
                    <p className="text-sm font-medium text-[#2C302E]/60">Browse the shop to find something you love.</p>
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
                      const itemDetails = order.items.map((i) => {
                        const prod = PRODUCTS.find((p) => p.id === i.productId);
                        return { ...i, product: prod };
                      });

                      return (
                        <div
                          key={order.id}
                          className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 hover:border-[#D4A373]/60 hover:shadow-[0_20px_40px_rgba(212,163,115,0.1)] transition-all duration-500"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#EFEBE4]">
                            <div>
                              <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#2C302E]">
                                {order.id}
                              </p>
                              <p className="text-xs font-medium text-[#2C302E]/50 mt-1">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                              <span
                                className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                                  order.fulfillmentType === 'in_stock'
                                    ? 'bg-[#52796F]/10 text-[#52796F]'
                                    : order.fulfillmentType === 'pre_order'
                                      ? 'bg-[#B85D43]/10 text-[#B85D43]'
                                      : 'bg-[#D4A373]/20 text-[#B85D43]'
                                }`}
                              >
                                {order.fulfillmentType === 'in_stock'
                                  ? 'In Stock'
                                  : order.fulfillmentType === 'pre_order'
                                    ? 'Pre-Order'
                                    : 'Mixed'}
                              </span>
                              <div
                                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}
                              >
                                <status.icon className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold tracking-widest uppercase">{status.label}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {itemDetails.map(
                              (item, idx) =>
                                item.product && (
                                  <div key={idx} className="flex items-center gap-4">
                                    <div className="relative w-16 h-20 rounded-t-[28px] rounded-b-[12px] overflow-hidden bg-[#EFEBE4] shrink-0 border border-[#EFEBE4]">
                                      <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-serif text-lg font-bold text-[#2C302E] truncate">
                                        {item.product.name}
                                      </h4>
                                      <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mt-1">
                                        Qty: {item.quantity}
                                        {item.fulfillment === 'in_stock'
                                          ? ' · In Stock · Ready in 1–2 days'
                                          : ` · Pre-Order · About ${item.promisedDays} days`}
                                      </p>
                                    </div>
                                    <p className="font-mono text-sm font-bold text-[#2C302E]">
                                      ${item.product.price * item.quantity}
                                    </p>
                                  </div>
                                )
                            )}
                          </div>

                          <div className="mt-6 pt-5 border-t border-[#EFEBE4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            <div className="font-mono text-sm font-bold">
                              <span className="text-[#2C302E]/50 font-medium">Total </span>
                              <span className="text-[#2C302E]">${order.totalPrice}</span>
                              <span className="mx-2 text-[#EFEBE4]">·</span>
                              <span className="text-[#2C302E]/50 font-medium">Paid </span>
                              <span className="text-[#B85D43]">${order.amountPaid}</span>
                            </div>

                            {order.status === 'pending_payment' && (
                              <button className="bg-[#B85D43] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#9c4d37] transition-colors">
                                Upload Deposit Proof
                              </button>
                            )}

                            {order.status === 'in_progress' && (
                              <button className="inline-flex items-center justify-center space-x-2 bg-[#2C302E] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#B85D43] transition-colors">
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Message Us</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CUSTOM ORDERS */}
            {activeTab === 'custom' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl text-[#2C302E]">Custom Orders</h2>
                    <p className="text-sm font-medium text-[#2C302E]/60 mt-1">
                      Requests made just for you.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-block bg-[#2C302E] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#B85D43] transition-colors text-center"
                  >
                    New Custom Order
                  </Link>
                </div>

                {myCustom.length === 0 ? (
                  <div className="rounded-[28px] border border-[#EFEBE4] bg-[#EFEBE4]/40 p-12 text-center space-y-4">
                    <p className="font-serif text-2xl text-[#2C302E]">No custom orders yet.</p>
                    <p className="text-sm font-medium text-[#2C302E]/60">
                      Tell us what you want and we will make it for you.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-block mt-2 bg-[#B85D43] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#9c4d37] transition-colors"
                    >
                      Start a Custom Order
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
                            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[220px] md:col-span-2">
                              <Image
                                src={order.referenceImageUrl}
                                alt="Reference"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-4 left-4 bg-[#FDFBF7]/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#B85D43]">
                                Reference Photo
                              </div>
                            </div>

                            <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                              <div>
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                  <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#2C302E]">
                                    {order.id}
                                  </p>
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
                                  Your Idea
                                </h4>
                                <p className="font-serif text-lg leading-relaxed text-[#2C302E] font-medium">
                                  {order.description}
                                </p>

                                {order.quotePrice && (
                                  <div className="mt-5 inline-block bg-[#EFEBE4]/70 px-5 py-3 rounded-2xl border border-[#EFEBE4]">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50 mb-1">
                                      Our Price
                                    </p>
                                    <p className="font-mono font-bold text-xl text-[#2C302E]">
                                      ${order.quotePrice}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <button className="self-start inline-flex items-center space-x-2 border border-[#2C302E]/15 text-[#2C302E] px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#EFEBE4] transition-colors">
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Open Chat</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl text-[#2C302E]">My Profile</h2>
                  <p className="text-sm font-medium text-[#2C302E]/60 mt-1">
                    Update your details and password.
                  </p>
                </div>

                {/* Personal details card — same shell as order cards */}
                <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 hover:border-[#D4A373]/60 hover:shadow-[0_20px_40px_rgba(212,163,115,0.1)] transition-all duration-500">
                  <div className="mb-6 pb-5 border-b border-[#EFEBE4]">
                    <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#2C302E]">
                      Personal Details
                    </p>
                    <p className="text-xs font-medium text-[#2C302E]/50 mt-1">
                      Your name and photo on this account.
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4A373]/40 shadow-sm shrink-0">
                        <Image src={user.avatarUrl!} alt="Avatar" fill className="object-cover" />
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center space-x-2 border border-[#2C302E]/15 text-[#2C302E] px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#EFEBE4] transition-colors"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.fullName}
                          className="w-full bg-[#EFEBE4]/40 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#D4A373] transition-colors font-serif text-lg font-medium text-[#2C302E]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full bg-[#EFEBE4]/60 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 text-[#2C302E]/50 font-mono text-sm cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="pt-2">
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
                <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-6 sm:p-8 hover:border-[#D4A373]/60 hover:shadow-[0_20px_40px_rgba(212,163,115,0.1)] transition-all duration-500">
                  <div className="mb-6 pb-5 border-b border-[#EFEBE4]">
                    <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#2C302E]">
                      Change Password
                    </p>
                    <p className="text-xs font-medium text-[#2C302E]/50 mt-1">
                      Keep your account safe with a new password.
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your current password"
                        className="w-full bg-[#EFEBE4]/40 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#D4A373] transition-colors text-sm font-medium text-[#2C302E] placeholder:text-[#2C302E]/35"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full bg-[#EFEBE4]/40 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#D4A373] transition-colors text-sm font-medium text-[#2C302E] placeholder:text-[#2C302E]/35"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/60">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Type it again"
                          className="w-full bg-[#EFEBE4]/40 border border-[#EFEBE4] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#D4A373] transition-colors text-sm font-medium text-[#2C302E] placeholder:text-[#2C302E]/35"
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
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
