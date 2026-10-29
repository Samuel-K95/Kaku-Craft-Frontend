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
  videoUrl?: string;
  /** Units currently available. 0 = out of stock (pre-order). */
  stock: number;
  /** Days to make when out of stock (pre-order). */
  productionDays: number;
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

// --- ADMIN / MOCK DOMAIN TYPES ---

export type AdminRole = 'ADMIN' | 'USER' | 'EXPERT';

export type OrderStatus =
  | 'pending_payment'
  | 'payment_submitted'
  | 'payment_verified'
  | 'in_progress'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  /** @deprecated prefer AdminRole via role field mapping */
  role: AdminRole | 'customer' | 'admin' | 'super_admin';
  avatarUrl?: string;
  joinedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl?: string;
  joinedAt: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MockColor {
  id: string;
  name: string;
  hex: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  hoverImage: string;
  categoryId: string;
  colorIds: string[];
  stock: number;
  estimatedDays: number;
  assignedExpertId: string | null;
  active: boolean;
  yarnType?: string;
  handcraftedHours?: number;
}

export type FulfillmentType = 'in_stock' | 'pre_order' | 'mixed';

export interface MockOrderItem {
  productId: string;
  quantity: number;
  /** Snapshot at order time */
  fulfillment: 'in_stock' | 'pre_order';
  /** Days promised for this line (1–2 in stock, or production days for pre-order) */
  promisedDays: number;
}

/** Expert production workflow on an assigned order */
export type ProductionStatus = 'not_started' | 'in_progress' | 'completed';

export interface MockOrder {
  id: string;
  userId: string;
  items: MockOrderItem[];
  /** Derived from items: all in stock, all pre-order, or both */
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  totalPrice: number;
  amountPaid: number;
  createdAt: string;
  estimatedCompletionAt?: string;
  assignedExpertId?: string | null;
  /** Lower number = higher precedence in the expert queue */
  precedence?: number;
  productionStatus?: ProductionStatus;
  /** Days the expert says it will take once started */
  expertEstimatedDays?: number;
  productionStartedAt?: string;
  productionCompletedAt?: string;
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
  estimatedCompletionAt?: string;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface SpecialOccasionContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  active: boolean;
}

export interface CmsContent {
  specialOccasion: SpecialOccasionContent;
  newArrivalProductIds: string[];
}

export type DiscountType = 'percent' | 'fixed';

export interface MockDiscount {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  productIds: string[] | 'all';
  startsAt: string;
  endsAt: string;
  active: boolean;
}
