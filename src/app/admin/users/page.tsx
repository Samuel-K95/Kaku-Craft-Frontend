'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { RoleBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import { api, normalizeError } from '@/lib/api';
import { ApiManagedUser } from '@/types/discounts';

const ROLE_LADDER = ['customer', 'expert', 'admin', 'super_admin'] as const;
type LadderRole = (typeof ROLE_LADDER)[number];

function normalizeRole(role: string): string {
  const r = role.toLowerCase();
  if (r === 'user') return 'customer';
  return r;
}

function displayRole(role: string): 'ADMIN' | 'EXPERT' | 'USER' {
  const r = normalizeRole(role);
  if (r === 'admin' || r === 'super_admin' || r === 'system_admin') return 'ADMIN';
  if (r === 'expert') return 'EXPERT';
  return 'USER';
}

function nextRole(role: string): LadderRole | null {
  const r = normalizeRole(role) as LadderRole;
  const idx = ROLE_LADDER.indexOf(r);
  if (idx < 0 || idx >= ROLE_LADDER.length - 1) return null;
  return ROLE_LADDER[idx + 1];
}

function prevRole(role: string): LadderRole | null {
  const r = normalizeRole(role) as LadderRole;
  const idx = ROLE_LADDER.indexOf(r);
  if (idx <= 0) return null;
  return ROLE_LADDER[idx - 1];
}

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'expert' | 'customer'>('all');
  const [pending, setPending] = useState<{
    user: ApiManagedUser;
    role: string;
    action: string;
  } | null>(null);
  const [error, setError] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, search],
    queryFn: () => {
      const q = new URLSearchParams();
      if (roleFilter !== 'all') q.set('role', roleFilter);
      if (search.trim()) q.set('search', search.trim());
      const qs = q.toString();
      return api.get<ApiManagedUser[]>(`/users/manage/${qs ? `?${qs}` : ''}`);
    },
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: number; role: string }) =>
      api.patch<ApiManagedUser>(`/users/manage/${vars.id}/`, { role: vars.role }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setPending(null);
      setError('');
    },
    onError: (err) => setError(normalizeError(err)),
  });

  const filtered = useMemo(() => users, [users]);

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Manage customer, expert, and admin roles."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-4 py-3 text-xs font-medium text-[#B85D43]">
          {error}
        </div>
      )}

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
          {(['all', 'admin', 'expert', 'customer'] as const).map((r) => (
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
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-sm text-[#2C302E]/50">
                    Loading users…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-sm text-[#2C302E]/50">
                    No users found.
                  </td>
                </tr>
              )}
              {filtered.map((u) => {
                const canPromote =
                  !!nextRole(u.role) && String(u.id) !== String(currentAdmin?.id);
                const canDemote =
                  !!prevRole(u.role) && String(u.id) !== String(currentAdmin?.id);
                return (
                  <tr key={u.id} className="border-b border-[#EFEBE4]/70 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D4A373]/30 shrink-0">
                          <Image
                            src={u.profile_picture || 'https://i.pravatar.cc/150'}
                            alt={u.full_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-lg font-bold text-[#2C302E] truncate">
                            {u.full_name}
                          </p>
                          <p className="text-xs font-medium text-[#2C302E]/50 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={displayRole(u.role)} />
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-xs font-medium text-[#2C302E]/60">
                      {new Date(u.date_joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={!canPromote}
                          onClick={() => {
                            const role = nextRole(u.role);
                            if (!role) return;
                            setPending({
                              user: u,
                              role,
                              action: `promote ${u.full_name} to ${role}`,
                            });
                          }}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/10 disabled:opacity-30 hover:bg-[#EFEBE4] transition-colors"
                        >
                          <ArrowUp className="w-3 h-3" />
                          Promote
                        </button>
                        <button
                          type="button"
                          disabled={!canDemote}
                          onClick={() => {
                            const role = prevRole(u.role);
                            if (!role) return;
                            setPending({
                              user: u,
                              role,
                              action: `demote ${u.full_name} to ${role}`,
                            });
                          }}
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
          if (pending) mutation.mutate({ id: pending.user.id, role: pending.role });
        }}
      />
    </div>
  );
}
