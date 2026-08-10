import { apiClient } from './client';

export interface SignalRecord {
  id: string;
  source_id: string;
  external_message_id: string;
  raw_message: string;
  status: 'parsed' | 'rejected' | 'pending';
  parse_confidence: number;
  received_at: string;
  created_at: string;
  source?: {
    display_name: string;
    external_chat_id: string;
    platform: string;
  };
  parsed_payload?: {
    action?: string;
    symbol?: string;
    entry?: number | null;
    stopLoss?: number | null;
    takeProfits?: number[];
  } | null;
}

export interface SignalSource {
  id: string;
  platform: string;
  external_chat_id: string;
  display_name: string;
  is_trusted: boolean;
  is_active: boolean;
  signal_count: number;
  created_at: string;
}

export const signalsApi = {
  /** Get recent signals (live trade feed) */
  getSignals: async (params?: { status?: string; limit?: number }): Promise<SignalRecord[]> => {
    const response = await apiClient.get('/signals', { params });
    return response.data;
  },

  /** Get connected signal sources (providers) */
  getSources: async (): Promise<SignalSource[]> => {
    const response = await apiClient.get('/signal-sources');
    return response.data;
  },

  /** Subscribe to a Telegram channel */
  subscribeChannel: async (channelIdentifier: string, displayName: string) => {
    const response = await apiClient.post('/signal-sources/subscribe', {
      channelIdentifier,
      displayName,
    });
    return response.data;
  },
};
