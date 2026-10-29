// ============================================================================
// 1. types/index.ts
// ============================================================================
export type ProductCategory = 
  | 'all' 
  | 'cardigans' 
  | 'sweaters' 
  | 'handbags' 
  | 'beanies' 
  | 'small-dolls' 
  | 'keychain-dolls';

export interface Product {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'all'>;
  price: number;
  rating: number;
  reviewsCount: number;
  tag: string;
  modelHeight?: string;
  image: string;
  hoverImage: string;
  description: string;
  yarnType: string;
  handcraftedHours: number;
  colorway: string[];
  dimensions?: string;
  weightGrams?: number;
  patternType?: string;
  videoUrl?: string; // e.g. TikTok / Reel link
}

export interface FloatingYarnProps {
  side: 'left' | 'right';
  color: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  category: string;
  notes: string;
}

// --- NEW MOCK DOMAIN TYPES ---

export type OrderStatus = 'pending_payment' | 'payment_submitted' | 'payment_verified' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin' | 'super_admin';
  avatarUrl?: string;
}

export interface MockOrder {
  id: string;
  userId: string;
  items: { productId: string; quantity: number }[];
  status: OrderStatus;
  totalPrice: number;
  amountPaid: number;
  createdAt: string;
}

export interface MockCustomOrder {
  id: string;
  userId: string;
  description: string;
  referenceImageUrl: string;
  status: OrderStatus;
  quotePrice?: number;
  amountPaid: number;
  createdAt: string;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
}