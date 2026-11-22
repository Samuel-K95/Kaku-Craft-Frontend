export interface ApiDiscount {
  id: number;
  name: string;
  code: string;
  discount_type: 'percent' | 'amount';
  value: string | number;
  applies_to_all: boolean;
  product_ids: number[];
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiManagedUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  profile_picture?: string | null;
  is_active: boolean;
  date_joined: string;
}
