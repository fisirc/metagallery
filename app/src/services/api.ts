import { API_URL } from '@/constants';
import { useUser } from '@/stores/useUser';
import axios from 'axios';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useUser.getState().token;
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
