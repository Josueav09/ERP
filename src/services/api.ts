import axios from 'axios';
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE as string) || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach token from storage
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.token) {
        // axios v1 headers may be AxiosHeaders instance; set Authorization safely
        // headers can be undefined during initial config, so coerce to any
        (config.headers as any) = (config.headers as any) || {};
        (config.headers as any).Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch (e) {}
  return config;
});

// Basic response interceptor (refresh token placeholder)
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err) => {
    // TODO: implement refresh token flow
    return Promise.reject(err);
  }
);

export default api;
