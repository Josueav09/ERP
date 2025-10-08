import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '../types/api';
import { API_CONFIG, MICROSERVICES } from '../config/config';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
    }

    const tenant = sessionStorage.getItem('tenant');
    if (tenant) config.headers['X-Tenant-ID'] = tenant;

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, { refreshToken });
          const { token } = response.data.data;

          const userStr = sessionStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.token = token;
            sessionStorage.setItem('user', JSON.stringify(user));
          }

          if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
      details: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);

// Helper functions
export const handleApiResponse = <T>(response: any): ApiResponse<T> => response.data;
export const handleApiError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message,
      code: error.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
      details: error.response?.data,
    };
    throw apiError;
  }
  throw error;
};

export default api;
export { MICROSERVICES };
