import { apiClient } from './client';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    // other fields if returned
  };
}

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};
