'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck, Clock, Package, Sparkles, X, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { ApiNotification } from '@/types/notifications';

function formatNotificationTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

function getEventIcon(event: string) {
  if (event.includes('order')) return Package;
  if (event.includes('payment')) return Sparkles;
  if (event.includes('message')) return MessageSquare;
  return Bell;
}

export const NotificationMenu: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const { data: notifications = [] } = useQuery<ApiNotification[]>({
    queryKey: ['notifications'],
    queryFn: () => api.get<ApiNotification[]>('/notifications/'),
    enabled: isAuthenticated,
    refetchInterval: 15 * 1000, // poll every 15s in background
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Mark single notification as read
  const markReadMutation = useMutation({
    mutationFn: (id: number) => api.post(`/notifications/${id}/read/`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read
  const markAllReadMutation = useMutation({
    mutationFn: () => api.post('/notifications/read-all/', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[#EFEBE4] text-[#2C302E] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B85D43] text-white text-[10px] font-bold flex items-center justify-center font-mono animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-[24px] bg-[#FDFBF7] border border-[#EFEBE4] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-[#EFEBE4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-[#2C302E]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#B85D43]/10 text-[#B85D43] text-[10px] font-bold font-mono">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="text-[10px] uppercase font-bold tracking-widest text-[#B85D43] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#EFEBE4]/60">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#2C302E]/50 font-medium space-y-1">
                <Bell className="w-6 h-6 mx-auto mb-2 text-[#2C302E]/30" />
                <p>No notifications yet</p>
                <p className="text-[11px] text-[#2C302E]/40">Updates about your orders will appear here.</p>
              </div>
            ) : (
              notifications.map((item) => {
                const IconComponent = getEventIcon(item.event);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.is_read) markReadMutation.mutate(item.id);
                    }}
                    className={`p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                      item.is_read ? 'bg-transparent hover:bg-[#EFEBE4]/40' : 'bg-[#B85D43]/5 hover:bg-[#B85D43]/10'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        item.is_read
                          ? 'bg-[#EFEBE4] text-[#2C302E]/60'
                          : 'bg-[#B85D43] text-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate ${item.is_read ? 'font-medium text-[#2C302E]' : 'font-bold text-[#2C302E]'}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-[#2C302E]/40 font-mono shrink-0">
                          {formatNotificationTime(item.created_at)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#2C302E]/70 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.body}
                      </p>
                    </div>

                    {!item.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#B85D43] shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#EFEBE4]/50 border-t border-[#EFEBE4] text-center">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="text-[10px] uppercase font-bold tracking-widest text-[#2C302E]/70 hover:text-[#B85D43] transition-colors"
            >
              Go to Account Center →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
