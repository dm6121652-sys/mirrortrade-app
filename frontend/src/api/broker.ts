import { apiClient } from './client';

export const brokerApi = {
  connect: async (apiToken: string, accountReference: string) => {
    const response = await apiClient.post('/broker-accounts/demo', {
      broker: 'deriv_mt5',
      accountReference,
      apiToken,
    });
    return response.data;
  },

  list: async () => {
    const response = await apiClient.get('/broker-accounts');
    return response.data;
  },
};
