// ============================================================================
// 1. types/index.ts
// ============================================================================
export type PageView = 'landing' | 'shop' | 'about' | 'contact';

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