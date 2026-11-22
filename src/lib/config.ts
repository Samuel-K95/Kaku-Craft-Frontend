/**
 * Public API / WS endpoints.
 * Prefer env vars (set in Vercel / Render). Fall back to the staging backend in
 * production so a missing dashboard env doesn't silently empty the catalog.
 */
const STAGING_API = 'https://kaku-craft-backend.onrender.com/api';
const STAGING_WS = 'wss://kaku-craft-backend.onrender.com/ws';
const LOCAL_API = 'http://127.0.0.1:8000/api';
const LOCAL_WS = 'ws://127.0.0.1:8000/ws';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? STAGING_API : LOCAL_API);

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  (process.env.NODE_ENV === 'production' ? STAGING_WS : LOCAL_WS);
