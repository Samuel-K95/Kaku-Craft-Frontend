import { AuthTokens, BackendUserPayload, RefreshResponse, User } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const TOKEN_STORAGE_KEY = 'kaku_access_token';
const REFRESH_STORAGE_KEY = 'kaku_refresh_token';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getStoredTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;
  const access = localStorage.getItem(TOKEN_STORAGE_KEY);
  const refresh = localStorage.getItem(REFRESH_STORAGE_KEY);
  if (!access || !refresh) return null;
  return { access, refresh };
}

export function setStoredTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, tokens.access);
  localStorage.setItem(REFRESH_STORAGE_KEY, tokens.refresh);
}

export function clearStoredTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_STORAGE_KEY);
  // Fire-and-forget clear of httpOnly session cookies used by middleware.
  void fetch('/api/auth/session', { method: 'DELETE' }).catch(() => undefined);
  window.dispatchEvent(new Event('auth:logout'));
}

export function mapBackendUser(payload: BackendUserPayload): User {
  return {
    id: payload.id,
    email: payload.email,
    fullName: payload.full_name,
    role: payload.role,
    avatarUrl: payload.profile_picture,
    dateJoined: payload.date_joined,
  };
}

export function normalizeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (typeof error.data === 'string') {
      return error.data;
    }
    if (error.data && typeof error.data === 'object') {
      const record = error.data as Record<string, unknown>;
      if (typeof record.detail === 'string') {
        return record.detail;
      }
      if (Array.isArray(record.non_field_errors) && record.non_field_errors.length > 0) {
        return String(record.non_field_errors[0]);
      }
      for (const [field, val] of Object.entries(record)) {
        if (Array.isArray(val) && val.length > 0) {
          return `${field}: ${val[0]}`;
        }
        if (typeof val === 'string') {
          return `${field}: ${val}`;
        }
      }
    }
    return error.message || 'An unexpected server error occurred.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'A network error occurred. Please check your connection.';
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const tokens = getStoredTokens();
    if (!tokens?.refresh) {
      clearStoredTokens();
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });

      if (!response.ok) {
        clearStoredTokens();
        return null;
      }

      const data = (await response.json()) as RefreshResponse;
      setStoredTokens({ access: data.access, refresh: tokens.refresh });
      // Keep middleware cookies in sync with refreshed access token.
      void fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access: data.access, refresh: tokens.refresh }),
      }).catch(() => undefined);
      return data.access;
    } catch {
      clearStoredTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { requiresAuth = true, headers: customHeaders, ...rest } = config;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(customHeaders);
  const isFormData = rest.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (requiresAuth) {
    const tokens = getStoredTokens();
    if (tokens?.access) {
      headers.set('Authorization', `Bearer ${tokens.access}`);
    }
  }

  let response = await fetch(url, { ...rest, headers });

  if (response.status === 401 && requiresAuth) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers.set('Authorization', `Bearer ${newAccess}`);
      response = await fetch(url, { ...rest, headers });
    }
  }

  if (!response.ok) {
    let errBody: unknown;
    try {
      errBody = await response.json();
    } catch {
      errBody = await response.text();
    }
    throw new ApiError(response.statusText || 'Request failed', response.status, errBody);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return request<T>(endpoint, { method: 'GET', ...options });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestConfig): Promise<T> {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestConfig): Promise<T> {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      method: 'PATCH',
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE', ...options });
  },

  upload<T>(endpoint: string, formData: FormData, options?: RequestConfig): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: formData,
      ...options,
    });
  },
};

