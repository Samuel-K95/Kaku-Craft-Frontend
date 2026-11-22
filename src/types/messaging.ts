export interface ApiMessage {
  id: number;
  sender: number;
  sender_email: string;
  sender_role: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface ApiConversation {
  id: number;
  customer: number;
  order?: number | null;
  custom_order?: number | null;
  subject: string;
  is_closed: boolean;
  messages: ApiMessage[];
  unread_count: number;
  created_at: string;
  updated_at: string;
}
