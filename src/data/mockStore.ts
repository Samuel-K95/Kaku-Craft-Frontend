import { MockUser, MockOrder, MockCustomOrder, MockMessage } from '@/types';

export const MOCK_USERS: MockUser[] = [
  {
    id: 'u-1',
    email: 'customer@example.com',
    fullName: 'Yodit Alemu',
    role: 'customer',
    avatarUrl: 'https://i.pravatar.cc/150?img=47'
  },
  {
    id: 'a-1',
    email: 'admin@kakucraft.com',
    fullName: 'Kaku Artisan',
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?img=68'
  }
];

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ord-1001',
    userId: 'u-1',
    items: [{ productId: 'card-1', quantity: 1 }],
    status: 'in_progress',
    totalPrice: 240,
    amountPaid: 120, // 50% deposit paid
    createdAt: '2026-10-25T14:32:00Z'
  },
  {
    id: 'ord-1002',
    userId: 'u-1',
    items: [{ productId: 'bag-1', quantity: 1 }],
    status: 'pending_payment',
    totalPrice: 120,
    amountPaid: 0,
    createdAt: '2026-10-28T09:15:00Z'
  }
];

export const MOCK_CUSTOM_ORDERS: MockCustomOrder[] = [
  {
    id: 'cust-2001',
    userId: 'u-1',
    description: 'I would like a custom oversized sweater mimicking the Terra cotta vibes but with a balloon sleeve.',
    referenceImageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop',
    status: 'payment_verified',
    quotePrice: 300,
    amountPaid: 150,
    createdAt: '2026-10-20T11:00:00Z'
  }
];

export const MOCK_CHATS: MockMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1', // Linked to cust-2001
    senderId: 'u-1',
    body: 'Hello! I submitted a bespoke request. Let me know if you need more details on the sleeves.',
    createdAt: '2026-10-20T11:05:00Z'
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'a-1',
    body: 'Hi Yodit, we have received your request. The balloon sleeve modification looks great. I will issue a quote shortly.',
    createdAt: '2026-10-20T11:45:00Z'
  }
];