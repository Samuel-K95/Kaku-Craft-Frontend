export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
}

export interface ApiProduct {
  id: number;
  category: number;
  category_name: string;
  category_slug: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  size: string;
  status: 'draft' | 'active' | 'out_of_stock' | 'archived';
  is_active: boolean;
  sold_count: number;
  social_links: Record<string, string>;
  images: ApiProductImage[];
  created_at: string;
  updated_at: string;
}

