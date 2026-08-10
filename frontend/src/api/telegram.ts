import client from './client';

export interface TelegramChannelInfo {
  id: string;
  title: string;
  username: string | null;
  memberCount: number;
  isPublic: boolean;
  description: string | null;
}

export const telegramApi = {
  /**
   * Resolve, join, and store a public Telegram channel using MTProto
   */
  connectChannel: async (channel_identifier: string): Promise<{ ok: boolean; channel: TelegramChannelInfo }> => {
    const response = await client.post('/telegram/sources', { channel_identifier });
    return response.data;
  },

  /**
   * List all connected Telegram channels for the current user
   */
  listChannels: async () => {
    const response = await client.get('/telegram/sources');
    return response.data;
  }
};
