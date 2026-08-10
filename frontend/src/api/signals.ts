import { apiClient } from './client';

export const signalsApi = {
  subscribeChannel: async (channelIdentifier: string, displayName: string) => {
    const response = await apiClient.post('/signal-sources/subscribe', {
      channelIdentifier,
      displayName,
    });
    return response.data;
  },

  listChannels: async () => {
    const response = await apiClient.get('/signal-sources');
    return response.data;
  },
};
