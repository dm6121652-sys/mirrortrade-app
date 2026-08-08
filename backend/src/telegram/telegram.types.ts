/**
 * Telegram API Type Definitions
 * Subset of types needed for signal ingestion webhook
 */

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  edited_channel_post?: TelegramMessage;
}

export interface TelegramMessage {
  message_id: number;
  date: number; // Unix timestamp
  chat: TelegramChat;
  from?: TelegramUser;
  text?: string;
  entities?: TelegramMessageEntity[];
  reply_to_message?: TelegramMessage;
  forward_from?: TelegramUser;
  forward_from_chat?: TelegramChat;
  forward_date?: number;
  edit_date?: number;
  type?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo?: TelegramChatPhoto;
  description?: string;
  linked_chat_id?: number;
  location?: TelegramChatLocation;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramMessageEntity {
  type: 'mention' | 'hashtag' | 'cashtag' | 'bot_command' | 'url' | 'email' | 'phone_number' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'spoiler' | 'code' | 'pre' | 'text_link' | 'text_mention';
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
  language?: string;
}

export interface TelegramChatPhoto {
  small_file_id: string;
  small_file_unique_id: string;
  big_file_id: string;
  big_file_unique_id: string;
}

export interface TelegramChatLocation {
  longitude: number;
  latitude: number;
  horizontal_accuracy?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

export interface TelegramWebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  ip_address?: string;
  last_error_date?: number;
  last_error_message?: string;
  last_synchronization_error_date?: number;
  max_connections?: number;
  allowed_updates?: string[];
}

export interface TelegramBotCommand {
  command: string;
  description: string;
}

/**
 * Internal types for MirrorTrade
 */
export interface ParsedTelegramSignal {
  sourceId: string;
  sourceName: string;
  messageId: string;
  rawText: string;
  parsedAt: Date;
  isTrusted: boolean;
}

export interface TelegramSignalStats {
  total_received: number;
  total_parsed: number;
  total_rejected: number;
  unique_sources: number;
  trusted_sources: number;
  last_signal_at?: Date;
}
