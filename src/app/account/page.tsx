'use client';

import React, { useState } from 'react';
import { MOCK_USERS, MOCK_ORDERS, MOCK_CUSTOM_ORDERS } from '@/data/mockStore';
import { PRODUCTS } from '@/data/products';
import Image from 'next/image';
import { Package, MessageCircle, LogOut, UploadCloud, ChevronRight, User, Settings, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { OrderStatus } from '@/types';

import { X } from 'lucide-react';

type TabView = 'orders' | 'bespoke' | 'profile';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabView>('orders');
  
  // Using the first mock customer
  const user = MOCK_USERS[0];
  const myOrders = MOCK_ORDERS.filter(o => o.userId === user.id);
  const myBespoke = MOCK_CUSTOM_ORDERS.filter(o => o.userId === user.id);

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment': return { label: 'Awaiting Deposit', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' };
      case 'payment_submitted': return { label: 'Verifying Payment', icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'payment_verified': return { label: 'Payment Verified', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' };
      case 'in_progress': return { label: 'In Production', icon: Package, color: 'text-[#B85D43]', bg: 'bg-[#B85D43]/10' };
      case 'delivered': return { label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' };
      case 'completed': return { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' };
      case 'cancelled': return { label: 'Cancelled', icon: X, color: 'text-red-600', bg: 'bg-red-100' };
      default: return { label: status, icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 select-none">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        
        {/* User Profile Card */}
        <div className="bg-[#EFEBE4]/80 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-sm flex items-center space-x-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#D4A373]">
            <Image src={user.avatarUrl!} alt={user.fullName} fill className="object-cover" />
          </div>
          <div>
            <p className="font-serif text-lg leading-tight text-[#2C302E]">{user.fullName}</p>
            <p className="text-xs font-mono text-[#2C302E]/50">Client</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'orders' 
                ? 'bg-[#2C302E] text-white shadow-md' 
                : 'text-[#2C302E]/70 hover:bg-[#EFEBE4] hover:text-[#2C302E]'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">The Archive</span>
          </button>

          <button 
            onClick={() => setActiveTab('bespoke')}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'bespoke' 
                ? 'bg-[#2C302E] text-white shadow-md' 
                : 'text-[#2C302E]/70 hover:bg-[#EFEBE4] hover:text-[#2C302E]'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">Bespoke</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'profile' 
                ? 'bg-[#2C302E] text-white shadow-md' 
                : 'text-[#2C302E]/70 hover:bg-[#EFEBE4] hover:text-[#2C302E]'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">Settings</span>
          </button>
        </nav>

        <div className="pt-4 border-t border-[#EFEBE4]">
          <button className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-red-700/70 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1">
        
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="font-serif text-4xl text-[#2C302E] mb-2">Order Archive</h1>
              <p className="text-sm text-[#2C302E]/60">Track the production of your handcrafted pieces.</p>
            </div>

            <div className="space-y-6">
              {myOrders.map(order => {
                const status = getStatusDisplay(order.status);
                const itemDetails = order.items.map(i => {
                  const prod = PRODUCTS.find(p => p.id === i.productId);
                  return { ...i, product: prod };
                });

                return (
                  <div key={order.id} className="bg-white/70 backdrop-blur-md rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 shadow-sm group hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#2C302E]/10 pb-4">
                      <div>
                        <p className="font-mono text-sm font-bold text-[#2C302E]">{order.id.toUpperCase()}</p>
                        <p className="text-xs text-[#2C302E]/50 mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}>
                        <status.icon className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest uppercase">{status.label}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {itemDetails.map((item, idx) => item.product && (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="relative w-16 h-20 rounded-md overflow-hidden bg-[#EFEBE4] shrink-0">
                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-serif text-lg text-[#2C302E]">{item.product.name}</h4>
                            <p className="text-xs font-mono text-[#2C302E]/60">QTY: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold">${item.product.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#2C302E]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="font-mono text-sm">
                        <span className="text-[#2C302E]/60">Total: </span>
                        <span className="font-bold text-[#2C302E]">${order.totalPrice}</span>
                        <span className="mx-2 text-[#2C302E]/30">|</span>
                        <span className="text-[#2C302E]/60">Paid: </span>
                        <span className="font-bold text-[#B85D43]">${order.amountPaid}</span>
                      </div>
                      
                      {order.status === 'pending_payment' && (
                        <button className="w-full sm:w-auto bg-[#B85D43] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#9c4d37] transition-colors">
                          Upload Deposit Proof
                        </button>
                      )}
                      
                      {order.status === 'in_progress' && (
                        <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#2C302E] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#1a1c1b] transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>Message Artisan</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BESPOKE TAB */}
        {activeTab === 'bespoke' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl text-[#2C302E] mb-2">Bespoke Requests</h1>
                <p className="text-sm text-[#2C302E]/60">Custom visions, currently in review or production.</p>
              </div>
              <Link href="/contact" className="inline-block bg-[#2C302E] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#1a1c1b] transition-colors text-center">
                New Request
              </Link>
            </div>

            <div className="space-y-6">
              {myBespoke.map(order => {
                const status = getStatusDisplay(order.status);
                
                return (
                  <div key={order.id} className="bg-white/70 backdrop-blur-md rounded-3xl border border-[#EFEBE4] p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#2C302E]/10 pb-4">
                      <div>
                        <p className="font-mono text-sm font-bold text-[#2C302E]">{order.id.toUpperCase()}</p>
                        <p className="text-xs text-[#2C302E]/50 mt-1">{new Date(order.createdAt).toLocaleDateString('en-US')}</p>
                      </div>
                      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}>
                        <status.icon className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest uppercase">{status.label}</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0">
                        <Image src={order.referenceImageUrl} alt="Reference" fill className="object-cover" />
                        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                          Reference
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <h4 className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/50 mb-2">Your Vision</h4>
                          <p className="font-serif text-lg leading-relaxed text-[#2C302E]">{order.description}</p>
                        </div>
                        
                        {order.quotePrice && (
                          <div className="bg-[#EFEBE4]/50 p-4 rounded-xl border border-[#EFEBE4] inline-block">
                            <p className="text-xs uppercase tracking-widest font-bold text-[#D4A373] mb-1">Artisan Quote</p>
                            <p className="font-mono font-bold text-xl">${order.quotePrice}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#2C302E]/10 flex flex-col sm:flex-row items-center justify-end gap-4">
                      <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-transparent border border-[#2C302E]/20 text-[#2C302E] px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>Open Thread</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-[#EFEBE4] p-8 sm:p-12 shadow-sm animate-in fade-in duration-500 max-w-2xl">
            <h2 className="font-serif text-3xl text-[#2C302E] mb-8 border-b border-[#2C302E]/10 pb-4">Account Settings</h2>
            
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center space-x-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#EFEBE4]">
                  <Image src={user.avatarUrl!} alt="Avatar" fill className="object-cover" />
                </div>
                <button type="button" className="text-xs uppercase tracking-widest font-bold text-[#B85D43] hover:text-[#9c4d37] transition-colors flex items-center space-x-2">
                  <UploadCloud className="w-4 h-4" />
                  <span>Update Portrait</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">Full Name</label>
                  <input type="text" defaultValue={user.fullName} className="w-full bg-white/50 border border-[#2C302E]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A373] transition-colors font-serif text-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-[#2C302E]/60">Email Address</label>
                  <input type="email" defaultValue={user.email} className="w-full bg-[#EFEBE4]/50 border border-[#2C302E]/5 rounded-lg px-4 py-3 text-[#2C302E]/60 font-mono text-sm" disabled />
                </div>
              </div>

              <div className="pt-8">
                <button type="submit" className="bg-[#2C302E] text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#1a1c1b] transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </section>
    </main>
  );
}