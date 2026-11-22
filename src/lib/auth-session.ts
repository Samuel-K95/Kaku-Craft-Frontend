/** Cookie names shared by the session API route and Next middleware. */
export const AUTH_COOKIE_ACCESS = 'kaku_access';
export const AUTH_COOKIE_REFRESH = 'kaku_refresh';
export const AUTH_COOKIE_ROLE = 'kaku_role';

export const ADMIN_ROLES = new Set(['admin', 'super_admin', 'system_admin']);
export const EXPERT_ROLES = new Set(['expert']);

export function isAdminRole(role?: string | null): boolean {
  if (!role) return false;
  return ADMIN_ROLES.has(role.toLowerCase());
}

export function isExpertRole(role?: string | null): boolean {
  if (!role) return false;
  return EXPERT_ROLES.has(role.toLowerCase()) || isAdminRole(role);
}

export async function establishServerSession(tokens: {
  access: string;
  refresh: string;
}): Promise<{ ok: true; role: string } | { ok: false; error: string }> {
  try {
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokens),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { detail?: string };
      return { ok: false, error: data.detail || 'Could not establish secure session.' };
    }
    const data = (await res.json()) as { role: string };
    return { ok: true, role: data.role };
  } catch {
    return { ok: false, error: 'Could not establish secure session.' };
  }
}

export async function clearServerSession(): Promise<void> {
  try {
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch {
    // best-effort
  }
}
