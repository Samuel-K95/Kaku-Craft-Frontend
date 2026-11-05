export interface ApiCartItem {
  id: number;
  product: number;
  product_name: string;
  product_slug: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface ApiCart {
  id: number;
  items: ApiCartItem[];
  total_price: string;
  item_count: number;
  updated_at?: string;
}

export interface ApiOrderItem {
  id: number;
  product: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface ApiPaymentProof {
  id: number;
  order: number;
  image: string;
  amount: string;
  kind: 'deposit' | 'remaining' | 'full';
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  reviewed_at?: string | null;
  created_at: string;
}

export interface ApiOrder {
  id: number;
  status:
    | 'pending_payment'
    | 'payment_submitted'
    | 'payment_verified'
    | 'in_progress'
    | 'delivered'
    | 'completed'
    | 'cancelled';
  total_price: string;
  amount_paid: string;
  remaining_amount: string;
  deposit_required: string;
  has_minimum_deposit: boolean;
  is_fully_paid: boolean;
  shipping_address: string;
  notes: string;
  items: ApiOrderItem[];
  payment_proofs: ApiPaymentProof[];
  created_at: string;
  updated_at: string;
}

export interface ApiCustomOrderPaymentProof {
  id: number;
  custom_order: number;
  image: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  reviewed_at?: string | null;
  created_at: string;
}

export interface ApiCustomOrder {
  id: number;
  reference_image?: string | null;
  description: string;
  quoted_price?: string | null;
  amount_paid: string;
  remaining_amount: string;
  deposit_required: string;
  has_minimum_deposit: boolean;
  status:
    | 'pending_review'
    | 'approved'
    | 'rejected'
    | 'awaiting_payment'
    | 'payment_submitted'
    | 'in_progress'
    | 'completed';
  admin_note?: string;
  customer_confirmed: boolean;
  payment_proofs: ApiCustomOrderPaymentProof[];
  created_at: string;
  updated_at: string;
}
