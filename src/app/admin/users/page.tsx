'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { RoleBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { nextRole, prevRole, useAdminStore } from '@/context/AdminStoreContext';
import { AdminRole, AdminUser } from '@/types';

export default function AdminUsersPage() {
  const { users, currentAdmin, setUserRole } = useAdminStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminRole | 'all'>('all');
  const [pending, setPending] = useState<{ user: AdminUser; role: AdminRole; action: string } | null>(
    null
  );

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const requestPromote = (user: AdminUser) => {
    const role = nextRole(user.role);
    if (!role) return;
    setPending({ user, role, action: `promote ${user.fullName} to ${role}` });
  };

  const requestDemote = (user: AdminUser) => {
    const role = prevRole(user.role);
    if (!role) return;
    setPending({ user, role, action: `demote ${user.fullName} to ${role}` });
  };

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Manage ADMIN, USER, and EXPERT roles. Promote or demote anyone as needed."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C302E]/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FDFBF7] border border-[#EFEBE4] text-sm font-medium focus:outline-none focus:border-[#D4A373]"
          />
        </div>
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4]">
          {(['all', 'ADMIN', 'EXPERT', 'USER'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                roleFilter === r ? 'bg-[#B85D43] text-white' : 'text-[#2C302E]/70 hover:bg-[#FDFBF7]'
              }`}
            >
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EFEBE4] text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50">
                <th className="px-6 py-4">Person</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 hidden md:table-cell">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const canPromote = !!nextRole(user.role) && user.id !== currentAdmin.id;
                const canDemote = !!prevRole(user.role) && user.id !== currentAdmin.id;
                return (
                  <tr key={user.id} className="border-b border-[#EFEBE4]/70 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D4A373]/30 shrink-0">
                          <Image
                            src={user.avatarUrl || 'https://i.pravatar.cc/150'}
                            alt={user.fullName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-lg font-bold text-[#2C302E] truncate">
                            {user.fullName}
                          </p>
                          <p className="text-xs font-medium text-[#2C302E]/50 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-xs font-medium text-[#2C302E]/60">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={!canPromote}
                          onClick={() => requestPromote(user)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/10 disabled:opacity-30 hover:bg-[#EFEBE4] transition-colors"
                        >
                          <ArrowUp className="w-3 h-3" />
                          Promote
                        </button>
                        <button
                          type="button"
                          disabled={!canDemote}
                          onClick={() => requestDemote(user)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/10 disabled:opacity-30 hover:bg-[#EFEBE4] transition-colors"
                        >
                          <ArrowDown className="w-3 h-3" />
                          Demote
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!pending}
        title="Change Role"
        message={pending ? `Are you sure you want to ${pending.action}?` : ''}
        confirmLabel="Yes, Change"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) setUserRole(pending.user.id, pending.role);
          setPending(null);
        }}
      />
    </div>
  );
}
