// ============================================================================
// 1. types/index.ts
// ============================================================================
export type PageView = 'landing' | 'shop' | 'about' | 'contact';

export type ProductCategory = 'all' | 'wearables' | 'dolls' | 'accessories' | 'home';

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