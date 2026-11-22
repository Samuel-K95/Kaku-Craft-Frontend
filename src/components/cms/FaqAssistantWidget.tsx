'use client';

import React, { useState } from 'react';
import { MessageCircleQuestion, X, Send } from 'lucide-react';
import { api, normalizeError } from '@/lib/api';

export const FaqAssistantWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post<{ answer?: string; response?: string; matched?: string }>(
        '/cms/assistant/ask/',
        { question: question.trim() },
        { requiresAuth: false }
      );
      setAnswer(res.answer || res.response || res.matched || 'No matching FAQ found.');
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {open && (
        <div className="mb-3 w-[min(100vw-2rem,360px)] rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7]/95 backdrop-blur-md shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EFEBE4]">
            <div>
              <p className="font-serif text-lg font-bold">Ask Kaku</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/40">
                FAQ assistant
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X className="w-4 h-4 text-[#2C302E]/50" />
            </button>
          </div>
          <div className="p-5 space-y-3">
            {answer && (
              <div className="rounded-2xl bg-[#EFEBE4]/60 px-4 py-3 text-sm font-medium text-[#2C302E]/80">
                {answer}
              </div>
            )}
            {error && <p className="text-xs text-[#B85D43]">{error}</p>}
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about orders, deposits, shipping…"
              className="w-full rounded-2xl border border-[#EFEBE4] bg-white px-4 py-3 text-sm"
            />
            <button
              type="button"
              disabled={loading || !question.trim()}
              onClick={() => void ask()}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'Thinking…' : 'Ask'}
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ml-auto flex items-center gap-2 rounded-full bg-[#2C302E] text-white px-5 py-3.5 text-[10px] uppercase tracking-widest font-bold shadow-md hover:bg-[#B85D43] transition-colors"
      >
        <MessageCircleQuestion className="w-4 h-4" />
        FAQ Help
      </button>
    </div>
  );
};
