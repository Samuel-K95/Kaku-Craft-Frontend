export interface ApiWishlistItem {
  id: number;
  product: number;
  product_detail?: {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    images?: { image: string; is_primary: boolean }[];
  };
  created_at: string;
}

export interface ApiReview {
  id: number;
  product: number;
  product_name: string;
  order: number;
  user_email: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_flagged: boolean;
  created_at: string;
  updated_at?: string;
}
