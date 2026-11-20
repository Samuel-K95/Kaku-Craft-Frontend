export interface ApiSiteContent {
  id: number;
  key: string;
  section: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  image?: string | null;
  is_published: boolean;
  sort_order: number;
  updated_at?: string;
  created_at?: string;
}

export interface ApiFAQEntry {
  id: number;
  question: string;
  answer: string;
  keywords: string;
  is_active: boolean;
  updated_at?: string;
}
