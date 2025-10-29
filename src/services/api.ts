import { API_CONFIG } from '@/config/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    console.log('🔐 Configurando interceptors de axios...');

    this.api.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem('token');
        console.log('🔐 Interceptor Request - Token:', token ? 'EXISTE' : 'NO EXISTE');
        console.log('🔐 Interceptor Request - URL:', config.url);
        console.log('🔐 Interceptor Request - Headers antes:', config.headers);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Interceptor - ✅ Authorization header AGREGADO');
        } else {
          console.log('❌ Interceptor - NO hay token disponible');
        }

        console.log('🔐 Interceptor Request - Headers después:', config.headers);
        return config;
      },
      (error) => {
        console.error('❌ Interceptor request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Interceptor Response - Status:', response.status, 'URL:', response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ Interceptor Response error:', {
          status: error.response?.status,
          url: error.config?.url,
          headers: error.config?.headers
        });
        return Promise.reject(error);
      }
    );  
  }
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(endpoint, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(endpoint, config);
    return response.data;
  }

  // ✅ IMPLEMENTAR MÉTODO PATCH
  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(endpoint, data, config);
    return response.data;
  }
}

export const apiService = new ApiService();