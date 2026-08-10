import axios from 'axios';
import { getItem } from '../utils/storage';

// Use environment variable if set, otherwise fallback to Railway deployment URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://mirrortrade-app-production.up.railway.app/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if we have one saved
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error reading token from SecureStore', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
