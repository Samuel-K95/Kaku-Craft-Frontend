'use client';

import React, { useState } from 'react';
import { MOCK_USERS, MOCK_ORDERS, MOCK_CUSTOM_ORDERS } from '@/data/mockStore';
import { PRODUCTS } from '@/data/products';
import Image from 'next/image';
import { LayoutDashboard, PackageSearch, MessageSquare, BookOpen, AlertCircle, CheckCircle2, ChevronRight, LogOut, Search, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { OrderStatus } from '@/types';

type AdminTab = 'overview' | 'desk' | 'bespoke' | 'catalog';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const admin = MOCK_USERS[1];
  
  // Aggregate mock metrics
  const pendingProofs = MOCK_ORDERS.filter(o => o.status === 'payment_submitted');
  const activeProduction = MOCK_ORDERS.filter(o => o.status === 'in_progress');
  const newBespoke = MOCK_CUSTOM_ORDERS.filter(o => o.status === 'pending_payment' || o.status === 'payment_submitted');

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment': return <span className="bg-amber-100 text-amber-800 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold">Awaiting Deposit</span>;
      case 'payment_submitted': return <span className="bg-blue-100 text-blue-800 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold">Verify Proof</span>;
      case 'in_progress': return <span className="bg-[#D4A373]/20 text-[#D4A373] text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold">Production</span>;
      default: return <span className="bg-gray-800/50 text-gray-300 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold">{status}</span>;
    }
  };

  return (
    <main className="min-h-screen bg-[#1F2220] py-24 px-4 sm:px-6 flex flex-col md:flex-row gap-8 select-none">
      
      {/* Dark Back-Office Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        
        <div className="bg-[#2C302E] p-6 rounded-3xl border border-white/5 flex items-center space-x-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D4A373]">
            <Image src={admin.avatarUrl!} alt={admin.fullName} fill className="object-cover" />
          </div>
          <div>
            <p className="font-serif text-lg leading-tight text-white">{admin.fullName}</p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#D4A373]">Artisan Admin</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-colors ${activeTab === 'overview' ? 'bg-[#D4A373] text-white shadow-lg shadow-[#D4A373]/20' : 'text-white/50 hover:bg-[#2C302E] hover:text-white'}`}>
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-bold text-sm tracking-widest uppercase">Command Center</span>
            </div>
          </button>

          <button onClick={() => setActiveTab('desk')} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-colors ${activeTab === 'desk' ? 'bg-[#D4A373] text-white shadow-lg shadow-[#D4A373]/20' : 'text-white/50 hover:bg-[#2C302E] hover:text-white'}`}>
            <div className="flex items-center space-x-3">
              <PackageSearch className="w-5 h-5" />
              <span className="font-bold text-sm tracking-widest uppercase">Order Desk</span>
            </div>
            {pendingProofs.length > 0 && <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{pendingProofs.length}</span>}
          </button>

          <button onClick={() => setActiveTab('bespoke')} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-colors ${activeTab === 'bespoke' ? 'bg-[#D4A373] text-white shadow-lg shadow-[#D4A373]/20' : 'text-white/50 hover:bg-[#2C302E] hover:text-white'}`}>
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5" />
              <span className="font-bold text-sm tracking-widest uppercase">Bespoke Quotes</span>
            </div>
            {newBespoke.length > 0 && <span className="bg-[#D4A373] text-[#1F2220] text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{newBespoke.length}</span>}
          </button>

          <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-colors ${activeTab === 'catalog' ? 'bg-[#D4A373] text-white shadow-lg shadow-[#D4A373]/20' : 'text-white/50 hover:bg-[#2C302E] hover:text-white'}`}>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5" />
              <span className="font-bold text-sm tracking-widest uppercase">Catalog Studio</span>
            </div>
          </button>
        </nav>

        <div className="pt-4 border-t border-white/10">
          <Link href="/" className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-white/40 hover:bg-white/5 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">Exit to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Back-Office Content */}
      <section className="flex-1 space-y-8 min-w-0">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <h1 className="font-serif text-4xl text-white">Daily Digest</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#2C302E] p-6 rounded-3xl border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] tracking-widest uppercase text-white/50 font-bold">Unverified Deposits</p>
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                </div>
                <p className="font-serif text-5xl text-white">{pendingProofs.length}</p>
                <p className="text-xs text-blue-400 font-mono mt-4">Requires manual verification</p>
              </div>

              <div className="bg-[#2C302E] p-6 rounded-3xl border border-[#D4A373]/20">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] tracking-widest uppercase text-[#D4A373] font-bold">Active Production</p>
                  <Clock className="w-5 h-5 text-[#D4A373]" />
                </div>
                <p className="font-serif text-5xl text-white">{activeProduction.length}</p>
                <p className="text-xs text-white/50 font-mono mt-4">Orders currently being knitted</p>
              </div>

              <div className="bg-[#2C302E] p-6 rounded-3xl border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] tracking-widest uppercase text-white/50 font-bold">Pending Quotes</p>
                  <MessageSquare className="w-5 h-5 text-white/50" />
                </div>
                <p className="font-serif text-5xl text-white">{newBespoke.length}</p>
                <p className="text-xs text-white/50 font-mono mt-4">Awaiting pricing & hours</p>
              </div>
            </div>

            <div className="bg-[#2C302E] p-8 rounded-3xl border border-white/5">
              <h3 className="font-serif text-2xl text-white mb-6">Recent Standard Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/70">
                  <thead className="text-[10px] uppercase tracking-widest font-mono text-white/40 border-b border-white/10">
                    <tr>
                      <th className="pb-4 font-normal">Order ID</th>
                      <th className="pb-4 font-normal">Date</th>
                      <th className="pb-4 font-normal">Client</th>
                      <th className="pb-4 font-normal">Amount</th>
                      <th className="pb-4 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MOCK_ORDERS.map(order => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-mono font-bold text-white">{order.id}</td>
                        <td className="py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-4">{MOCK_USERS.find(u => u.id === order.userId)?.fullName}</td>
                        <td className="py-4 font-mono">${order.totalPrice}</td>
                        <td className="py-4">{getStatusBadge(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDER DESK (Kanban-ish Verification) */}
        {activeTab === 'desk' && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <h1 className="font-serif text-4xl text-white mb-8">Payment Verification Desk</h1>
            
            {pendingProofs.length === 0 ? (
              <div className="bg-[#2C302E] p-12 rounded-3xl border border-white/5 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-serif text-2xl text-white">All Clear</h3>
                <p className="text-white/50 text-sm">There are no pending deposit proofs to verify.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingProofs.map(order => (
                  <div key={order.id} className="bg-[#2C302E] p-6 rounded-3xl border border-blue-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="font-mono text-lg font-bold text-white">{order.id}</p>
                          <p className="text-xs text-white/50 mt-1">{MOCK_USERS.find(u => u.id === order.userId)?.email}</p>
                        </div>
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold">
                          Deposit Uploaded
                        </span>
                      </div>

                      <div className="bg-[#1F2220] p-4 rounded-2xl mb-6">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Claimed Transfer</p>
                        <p className="font-mono text-2xl text-[#D4A373]">${order.totalPrice * 0.5}</p>
                      </div>
                      
                      <button className="w-full flex items-center justify-center space-x-2 border border-white/20 rounded-xl py-3 text-sm text-white hover:bg-white/10 transition-colors">
                        <Search className="w-4 h-4" />
                        <span>View Attached Receipt</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                      <button className="bg-red-500/10 text-red-400 py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-red-500/20 transition-colors">
                        Reject
                      </button>
                      <button className="bg-emerald-500 text-white py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-emerald-600 transition-colors">
                        Approve & Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </section>
    </main>
  );
}