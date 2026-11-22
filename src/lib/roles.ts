import { MockUser } from '@/types';
import { User } from '@/types/auth';

export type RoleLike = MockUser | User | null | undefined;

export function isAdminUser(user?: RoleLike): boolean {
  if (!user) return false;
  const role = String(user.role).toLowerCase();
  return role === 'admin' || role === 'super_admin' || role === 'system_admin';
}

export function isExpertUser(user?: RoleLike): boolean {
  if (!user) return false;
  return String(user.role).toLowerCase() === 'expert';
}
