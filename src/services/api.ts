// import { API_CONFIG } from '@/config/config';
// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// class ApiService {
//   private api: AxiosInstance;

//   constructor() {
//     this.api = axios.create({
//       baseURL: API_CONFIG.baseURL,
//       timeout: API_CONFIG.timeout,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     this.setupInterceptors();
//   }

//   private setupInterceptors() {
//     console.log('🔐 Configurando interceptors de axios...');

//     this.api.interceptors.request.use(
//       (config) => {
//         const token = sessionStorage.getItem('token');
//         console.log('🔐 Interceptor Request - Token:', token ? 'EXISTE' : 'NO EXISTE');
//         console.log('🔐 Interceptor Request - URL:', config.url);
//         console.log('🔐 Interceptor Request - Headers antes:', config.headers);

//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//           console.log('🔐 Interceptor - ✅ Authorization header AGREGADO');
//         } else {
//           console.log('❌ Interceptor - NO hay token disponible');
//         }

//         console.log('🔐 Interceptor Request - Headers después:', config.headers);
//         return config;
//       },
//       (error) => {
//         console.error('❌ Interceptor request error:', error);
//         return Promise.reject(error);
//       }
//     );

//     this.api.interceptors.response.use(
//       (response) => {
//         console.log('✅ Interceptor Response - Status:', response.status, 'URL:', response.config.url);
//         return response;
//       },
//       (error) => {
//         console.error('❌ Interceptor Response error:', {
//           status: error.response?.status,
//           url: error.config?.url,
//           headers: error.config?.headers
//         });
//         return Promise.reject(error);
//       }
//     );  
//   }
//   async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
//     const response: AxiosResponse<T> = await this.api.get(endpoint, config);
//     return response.data;
//   }

//   async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//     const response: AxiosResponse<T> = await this.api.post(endpoint, data, config);
//     return response.data;
//   }

//   async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//     const response: AxiosResponse<T> = await this.api.put(endpoint, data, config);
//     return response.data;
//   }

//   async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
//     const response: AxiosResponse<T> = await this.api.delete(endpoint, config);
//     return response.data;
//   }

//   // ✅ IMPLEMENTAR MÉTODO PATCH
//   async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//     const response: AxiosResponse<T> = await this.api.patch(endpoint, data, config);
//     return response.data;
//   }
// }

// export const apiService = new ApiService();

import { API_CONFIG } from '@/config/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

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

    // ========== REQUEST INTERCEPTOR ==========
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

    // ========== RESPONSE INTERCEPTOR - ✅ CORREGIDO ==========
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Interceptor Response - Status:', response.status, 'URL:', response.config.url);
        return response;
      },
      (error: AxiosError<any>) => {
        console.error('❌ Interceptor Response error:', {
          status: error.response?.status,
          url: error.config?.url,
          headers: error.config?.headers,
          data: error.response?.data
        });

        // ✅ EXTRAER MENSAJE DE ERROR DEL BACKEND
        let errorMessage = 'Error de conexión con el servidor';
        let errorDetails = null;

        if (error.response) {
          // El servidor respondió con un código de error (4xx, 5xx)
          const data = error.response.data;
          
          console.log('📤 Error data del backend:', data);
          console.log('📤 Estructura completa:', JSON.stringify(data, null, 2));

          // ✅ EXTRACCIÓN ROBUSTA DEL MENSAJE
          if (data && typeof data === 'object') {
            // 1. Prioridad: campo "message"
            if (data.message) {
              if (Array.isArray(data.message)) {
                // class-validator devuelve array de errores
                errorMessage = data.message[0];
                console.log('📤 Mensaje extraído de array:', errorMessage);
              } else if (typeof data.message === 'string') {
                // NestJS estándar devuelve string
                errorMessage = data.message;
                console.log('📤 Mensaje extraído de string:', errorMessage);
              }
            } 
            // 2. Alternativa: campo "error" (solo si no es genérico)
            else if (data.error && typeof data.error === 'string') {
              const genericErrors = ['Unauthorized', 'Bad Request', 'Forbidden', 'Not Found', 'Internal Server Error'];
              if (!genericErrors.includes(data.error)) {
                errorMessage = data.error;
                console.log('📤 Mensaje extraído de error personalizado:', errorMessage);
              } else {
                // Error genérico, usar statusText
                errorMessage = error.response.statusText || 'Error en el servidor';
                console.log('📤 Error genérico detectado, usando statusText:', errorMessage);
              }
            }
            // 3. Fallback: statusText
            else {
              errorMessage = error.response.statusText || 'Error en el servidor';
              console.log('📤 Usando statusText como fallback:', errorMessage);
            }
          }

          errorDetails = {
            status: error.response.status,
            statusText: error.response.statusText,
            data: data
          };

          console.log('✅ Mensaje de error final extraído:', errorMessage);

          // ✅ MANEJAR ERRORES ESPECÍFICOS POR CÓDIGO DE ESTADO
          switch (error.response.status) {
            case 400:
              console.log('❌ Bad Request (400):', errorMessage);
              break;
            case 401:
              console.log('❌ Unauthorized (401):', errorMessage);
              // Solo limpiar sesión si es error de token, no de login
              if (errorMessage.toLowerCase().includes('token expired') || 
                  errorMessage.toLowerCase().includes('invalid token') ||
                  errorMessage.toLowerCase().includes('jwt')) {
                console.log('🔐 Token inválido detectado, limpiando sesión...');
                sessionStorage.removeItem('token');
                localStorage.removeItem('user');
              }
              break;
            case 403:
              console.log('❌ Forbidden (403):', errorMessage);
              break;
            case 404:
              console.log('❌ Not Found (404):', errorMessage);
              if (errorMessage === 'Not Found') {
                errorMessage = 'Recurso no encontrado';
              }
              break;
            case 429:
              console.log('❌ Too Many Requests (429):', errorMessage);
              if (!errorMessage.includes('intentos') && !errorMessage.includes('bloqueado')) {
                errorMessage = 'Demasiados intentos. Intente más tarde';
              }
              break;
            case 500:
              console.log('❌ Server Error (500):', errorMessage);
              if (errorMessage === 'Internal Server Error') {
                errorMessage = 'Error interno del servidor';
              }
              break;
            case 503:
              console.log('❌ Service Unavailable (503):', errorMessage);
              if (errorMessage === 'Service Unavailable') {
                errorMessage = 'Servicio no disponible temporalmente';
              }
              break;
            default:
              console.log('❌ Error HTTP', error.response.status + ':', errorMessage);
          }

        } else if (error.request) {
          // La petición se hizo pero no hubo respuesta
          console.error('❌ No se recibió respuesta del servidor');
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión';
          errorDetails = { request: error.request };

        } else {
          // Error al configurar la petición
          console.error('❌ Error configurando la petición:', error.message);
          errorMessage = error.message || 'Error al procesar la solicitud';
          errorDetails = { message: error.message };
        }

        // ✅ CREAR ERROR ESTRUCTURADO PARA EL FRONTEND
        const structuredError = {
          message: errorMessage,
          status: error.response?.status,
          statusText: error.response?.statusText,
          details: errorDetails,
          originalError: error
        };

        console.log('🔴 Error estructurado final:', structuredError);

        // ✅ RECHAZAR CON ERROR ESTRUCTURADO
        return Promise.reject(structuredError);
      }
    );
  }

  // ========== MÉTODOS HTTP ==========
  
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(endpoint, config);
      return response.data;
    } catch (error: any) {
      console.error(`❌ GET ${endpoint} falló:`, error.message);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      console.error(`❌ POST ${endpoint} falló:`, error.message);
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      console.error(`❌ PUT ${endpoint} falló:`, error.message);
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.patch(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      console.error(`❌ PATCH ${endpoint} falló:`, error.message);
      throw error;
    }
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(endpoint, config);
      return response.data;
    } catch (error: any) {
      console.error(`❌ DELETE ${endpoint} falló:`, error.message);
      throw error;
    }
  }

  // ========== MÉTODOS AUXILIARES ==========

  hasValidToken(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token;
  }

  clearSession(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('🔐 Sesión limpiada');
  }

  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

export const apiService = new ApiService();