export interface ApiNotification {
  id: number;
  event: string;
  title: string;
  body: string;
  payload: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface ApiTelegramLink {
  link_token: string;
  telegram_chat_id: string;
  is_active: boolean;
  linked_at: string | null;
  bot_username: string;
  deep_link: string;
}
