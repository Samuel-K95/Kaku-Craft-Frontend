'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getStoredTokens, normalizeError } from '@/lib/api';
import { ApiConversation, ApiMessage } from '@/types/messaging';

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000/ws';

export const InboxPanel: React.FC<{
  allowCreate?: boolean;
  linkedOrderId?: number;
}> = ({ allowCreate = true, linkedOrderId }) => {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [body, setBody] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [liveMessages, setLiveMessages] = useState<ApiMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get<ApiConversation[]>('/messaging/conversations/'),
  });

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  useEffect(() => {
    if (active) setLiveMessages(active.messages || []);
  }, [active]);

  useEffect(() => {
    if (!activeId) return;
    const token = getStoredTokens()?.access;
    if (!token) return;

    const ws = new WebSocket(`${WS_BASE}/chat/${activeId}/?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ApiMessage & { type?: string };
        if (data.body) {
          setLiveMessages((prev) => {
            if (prev.some((m) => m.id === data.id)) return prev;
            return [...prev, data as ApiMessage];
          });
        }
      } catch {
        // ignore non-json
      }
    };
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [activeId]);

  const createMutation = useMutation({
    mutationFn: () =>
      api.post<ApiConversation>('/messaging/conversations/', {
        subject: subject || 'Support',
        body: body || 'Hello',
        order_id: linkedOrderId,
      }),
    onSuccess: (conv) => {
      void queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setActiveId(conv.id);
      setBody('');
      setSubject('');
      setError('');
    },
    onError: (err) => setError(normalizeError(err)),
  });

  const sendMutation = useMutation({
    mutationFn: () =>
      api.post<ApiMessage>(`/messaging/conversations/${activeId}/messages/`, { body }),
    onSuccess: (msg) => {
      setLiveMessages((prev) => [...prev, msg]);
      setBody('');
      void queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ body: msg.body }));
      }
    },
    onError: (err) => setError(normalizeError(err)),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 min-h-[420px]">
      <div className="rounded-[24px] border border-[#EFEBE4] bg-[#FDFBF7] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#EFEBE4] text-[10px] uppercase tracking-widest font-bold">
          Conversations
        </div>
        <div className="max-h-[480px] overflow-y-auto">
          {isLoading && <p className="p-4 text-xs text-[#2C302E]/50">Loading…</p>}
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-4 py-3 border-b border-[#EFEBE4]/70 ${
                activeId === c.id ? 'bg-[#EFEBE4]' : 'hover:bg-[#EFEBE4]/40'
              }`}
            >
              <p className="font-serif font-bold text-sm truncate">{c.subject || `Thread #${c.id}`}</p>
              <p className="text-[10px] text-[#2C302E]/50 mt-1">
                {c.unread_count ? `${c.unread_count} unread · ` : ''}
                {new Date(c.updated_at).toLocaleDateString()}
              </p>
            </button>
          ))}
          {!isLoading && conversations.length === 0 && (
            <p className="p-4 text-xs text-[#2C302E]/50">No conversations yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-[#EFEBE4] bg-[#FDFBF7] flex flex-col min-h-[420px]">
        {error && (
          <div className="m-4 rounded-2xl bg-[#B85D43]/10 px-3 py-2 text-xs text-[#B85D43]">
            {error}
          </div>
        )}
        {!active && allowCreate && (
          <div className="p-6 space-y-4">
            <h3 className="font-serif text-2xl">Start a conversation</h3>
            <input
              className="w-full rounded-2xl border border-[#EFEBE4] px-4 py-3 text-sm"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              className="w-full rounded-2xl border border-[#EFEBE4] px-4 py-3 text-sm"
              rows={3}
              placeholder="How can we help?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              className="px-5 py-3 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold"
            >
              Send
            </button>
          </div>
        )}
        {active && (
          <>
            <div className="px-5 py-4 border-b border-[#EFEBE4]">
              <p className="font-serif text-xl font-bold">{active.subject || `Thread #${active.id}`}</p>
              {active.is_closed && (
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#B85D43] mt-1">
                  Closed
                </p>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3 max-h-[360px]">
              {liveMessages.map((m) => (
                <div key={m.id} className="rounded-2xl bg-[#EFEBE4]/50 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/40 mb-1">
                    {m.sender_email} · {new Date(m.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium">{m.body}</p>
                </div>
              ))}
            </div>
            {!active.is_closed && (
              <div className="p-4 border-t border-[#EFEBE4] flex gap-2">
                <input
                  className="flex-1 rounded-full border border-[#EFEBE4] px-4 py-3 text-sm"
                  placeholder="Write a message…"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && body.trim()) sendMutation.mutate();
                  }}
                />
                <button
                  type="button"
                  disabled={!body.trim() || sendMutation.isPending}
                  onClick={() => sendMutation.mutate()}
                  className="px-5 py-3 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-widest font-bold disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
