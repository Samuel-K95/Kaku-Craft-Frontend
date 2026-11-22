'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { InboxPanel } from '@/components/messaging/InboxPanel';

export default function AdminInboxPage() {
  return (
    <div>
      <AdminPageHeader
        title="Inbox"
        description="Customer support conversations linked to orders and custom requests."
      />
      <InboxPanel allowCreate={false} />
    </div>
  );
}
