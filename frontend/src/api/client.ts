import axios from 'axios';
import { getItem } from '../utils/storage';

const envBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const defaultRailwayUrl = 'https://mirrortrade-app-production.up.railway.app/api/v1';
const BASE_URL = envBaseUrl && !/localhost|127\.0\.0\.1/i.test(envBaseUrl)
  ? envBaseUrl
  : defaultRailwayUrl;

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
