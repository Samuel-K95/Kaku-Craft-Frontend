import {
  AdminProduct,
  AdminUser,
  CmsContent,
  MockCategory,
  MockColor,
  MockDiscount,
  MockOrder,
} from '@/types';
import { PRODUCTS } from '@/data/products';

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'a-1',
    email: 'admin@kakucraft.com',
    fullName: 'Kaku Admin',
    role: 'ADMIN',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    joinedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'u-1',
    email: 'customer@example.com',
    fullName: 'Yodit Alemu',
    role: 'USER',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    joinedAt: '2025-06-12T10:00:00Z',
  },
  {
    id: 'u-2',
    email: 'selam@example.com',
    fullName: 'Selam Bekele',
    role: 'USER',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
    joinedAt: '2025-08-02T10:00:00Z',
  },
  {
    id: 'u-3',
    email: 'helen@example.com',
    fullName: 'Helen Tadesse',
    role: 'USER',
    avatarUrl: 'https://i.pravatar.cc/150?img=20',
    joinedAt: '2025-09-18T10:00:00Z',
  },
  {
    id: 'e-1',
    email: 'meron.expert@kakucraft.com',
    fullName: 'Meron Assefa',
    role: 'EXPERT',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    joinedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'e-2',
    email: 'abel.expert@kakucraft.com',
    fullName: 'Abel Girma',
    role: 'EXPERT',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    joinedAt: '2025-04-14T10:00:00Z',
  },
  {
    id: 'e-3',
    email: 'sara.expert@kakucraft.com',
    fullName: 'Sara Negash',
    role: 'EXPERT',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    joinedAt: '2025-05-20T10:00:00Z',
  },
  {
    id: 'a-2',
    email: 'ops@kakucraft.com',
    fullName: 'Liya Ops',
    role: 'ADMIN',
    avatarUrl: 'https://i.pravatar.cc/150?img=44',
    joinedAt: '2025-02-01T10:00:00Z',
  },
];

export const ADMIN_CATEGORIES: MockCategory[] = [
  { id: 'cat-cardigans', name: 'Cardigans', slug: 'cardigans' },
  { id: 'cat-sweaters', name: 'Sweaters', slug: 'sweaters' },
  { id: 'cat-handbags', name: 'Handbags', slug: 'handbags' },
  { id: 'cat-beanies', name: 'Beanies', slug: 'beanies' },
  { id: 'cat-small-dolls', name: 'Small Dolls', slug: 'small-dolls' },
  { id: 'cat-keychain-dolls', name: 'Keychain Dolls', slug: 'keychain-dolls' },
];

export const ADMIN_COLORS: MockColor[] = [
  { id: 'col-terracotta', name: 'Terracotta', hex: '#B85D43' },
  { id: 'col-sand', name: 'Sand', hex: '#D4A373' },
  { id: 'col-cream', name: 'Cream', hex: '#FDFBF7' },
  { id: 'col-charcoal', name: 'Charcoal', hex: '#2C302E' },
  { id: 'col-sage', name: 'Sage', hex: '#52796F' },
  { id: 'col-blush', name: 'Blush', hex: '#E78EA9' },
  { id: 'col-moss', name: 'Moss', hex: '#A3B19B' },
  { id: 'col-linen', name: 'Linen', hex: '#C2B8A3' },
];

const categorySlugToId = Object.fromEntries(
  ADMIN_CATEGORIES.map((c) => [c.slug, c.id])
);

const hexToColorId = Object.fromEntries(ADMIN_COLORS.map((c) => [c.hex.toLowerCase(), c.id]));

const expertCycle = ['e-1', 'e-2', 'e-3'];

export const ADMIN_PRODUCTS: AdminProduct[] = PRODUCTS.map((p, idx) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  image: p.image,
  hoverImage: p.hoverImage,
  categoryId: categorySlugToId[p.category] ?? 'cat-cardigans',
  colorIds: p.colorway
    .map((hex) => hexToColorId[hex.toLowerCase()])
    .filter(Boolean) as string[],
  stock: p.stock,
  estimatedDays: p.productionDays,
  assignedExpertId: expertCycle[idx % expertCycle.length],
  active: p.stock > 0,
  yarnType: p.yarnType,
  handcraftedHours: p.handcraftedHours,
}));

export const ADMIN_ORDERS: MockOrder[] = [
  {
    id: 'ord-1001',
    userId: 'u-1',
    items: [
      { productId: 'card-1', quantity: 1, fulfillment: 'in_stock', promisedDays: 2 },
    ],
    fulfillmentType: 'in_stock',
    status: 'in_progress',
    totalPrice: 240,
    amountPaid: 120,
    createdAt: '2026-10-05T14:32:00Z',
    estimatedCompletionAt: '2026-10-07T00:00:00Z',
    assignedExpertId: 'e-1',
    precedence: 1,
    productionStatus: 'in_progress',
    expertEstimatedDays: 2,
    productionStartedAt: '2026-10-05T16:00:00Z',
  },
  {
    id: 'ord-1002',
    userId: 'u-1',
    items: [
      { productId: 'bag-1', quantity: 1, fulfillment: 'in_stock', promisedDays: 2 },
    ],
    fulfillmentType: 'in_stock',
    status: 'pending_payment',
    totalPrice: 130,
    amountPaid: 0,
    createdAt: '2026-10-20T09:15:00Z',
    estimatedCompletionAt: '2026-10-22T00:00:00Z',
    assignedExpertId: 'e-2',
    precedence: 5,
    productionStatus: 'not_started',
  },
  {
    id: 'ord-1003',
    userId: 'u-2',
    items: [
      { productId: 'swtr-2', quantity: 1, fulfillment: 'pre_order', promisedDays: 16 },
    ],
    fulfillmentType: 'pre_order',
    status: 'payment_submitted',
    totalPrice: 220,
    amountPaid: 110,
    createdAt: '2026-10-18T11:00:00Z',
    estimatedCompletionAt: '2026-11-03T00:00:00Z',
    assignedExpertId: 'e-3',
    precedence: 4,
    productionStatus: 'not_started',
  },
  {
    id: 'ord-1004',
    userId: 'u-3',
    items: [
      { productId: 'bean-1', quantity: 2, fulfillment: 'in_stock', promisedDays: 2 },
      { productId: 'key-2', quantity: 1, fulfillment: 'pre_order', promisedDays: 3 },
    ],
    fulfillmentType: 'mixed',
    status: 'payment_verified',
    totalPrice: 138,
    amountPaid: 69,
    createdAt: '2026-10-12T16:20:00Z',
    estimatedCompletionAt: '2026-10-15T00:00:00Z',
    assignedExpertId: 'e-1',
    precedence: 2,
    productionStatus: 'not_started',
  },
  {
    id: 'ord-1005',
    userId: 'u-2',
    items: [
      { productId: 'doll-1', quantity: 1, fulfillment: 'in_stock', promisedDays: 2 },
    ],
    fulfillmentType: 'in_stock',
    status: 'delivered',
    totalPrice: 95,
    amountPaid: 95,
    createdAt: '2026-09-15T10:00:00Z',
    estimatedCompletionAt: '2026-09-17T00:00:00Z',
    assignedExpertId: 'e-1',
    precedence: 8,
    productionStatus: 'completed',
    expertEstimatedDays: 2,
    productionStartedAt: '2026-09-15T12:00:00Z',
    productionCompletedAt: '2026-09-16T18:00:00Z',
  },
  {
    id: 'ord-1006',
    userId: 'u-3',
    items: [
      { productId: 'card-2', quantity: 1, fulfillment: 'pre_order', promisedDays: 21 },
    ],
    fulfillmentType: 'pre_order',
    status: 'in_progress',
    totalPrice: 265,
    amountPaid: 132.5,
    createdAt: '2026-10-08T08:40:00Z',
    estimatedCompletionAt: '2026-10-29T00:00:00Z',
    assignedExpertId: 'e-1',
    precedence: 3,
    productionStatus: 'in_progress',
    expertEstimatedDays: 18,
    productionStartedAt: '2026-10-09T09:00:00Z',
  },
  {
    id: 'ord-1007',
    userId: 'u-1',
    items: [
      { productId: 'bean-2', quantity: 1, fulfillment: 'pre_order', promisedDays: 5 },
      { productId: 'doll-2', quantity: 1, fulfillment: 'pre_order', promisedDays: 14 },
    ],
    fulfillmentType: 'pre_order',
    status: 'payment_verified',
    totalPrice: 136,
    amountPaid: 68,
    createdAt: '2026-10-22T12:00:00Z',
    estimatedCompletionAt: '2026-11-05T00:00:00Z',
    assignedExpertId: 'e-1',
    precedence: 6,
    productionStatus: 'not_started',
  },
];

export const ADMIN_CMS: CmsContent = {
  specialOccasion: {
    title: 'Happy Holidays from Kaku Craft',
    subtitle:
      'Wishing you a warm and joyful season filled with love, laughter, and cozy handmade moments.',
    imageUrl:
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1200&auto=format&fit=crop',
    active: true,
  },
  newArrivalProductIds: ['card-1', 'swtr-1', 'bag-1', 'bean-1'],
};

export const ADMIN_DISCOUNTS: MockDiscount[] = [
  {
    id: 'disc-1',
    name: 'Holiday Warmth 15%',
    type: 'percent',
    value: 15,
    productIds: ['card-1', 'card-2', 'swtr-1', 'swtr-2'],
    startsAt: '2026-10-01T00:00:00Z',
    endsAt: '2026-11-30T23:59:59Z',
    active: true,
  },
  {
    id: 'disc-2',
    name: 'Charm Bundle $5 Off',
    type: 'fixed',
    value: 5,
    productIds: ['key-1', 'key-2'],
    startsAt: '2026-10-15T00:00:00Z',
    endsAt: '2026-12-15T23:59:59Z',
    active: true,
  },
  {
    id: 'disc-3',
    name: 'Summer Clearance',
    type: 'percent',
    value: 20,
    productIds: 'all',
    startsAt: '2026-06-01T00:00:00Z',
    endsAt: '2026-08-31T23:59:59Z',
    active: false,
  },
];

export const CURRENT_ADMIN_ID = 'a-1';
