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

    // ========== REQUEST INTERCEPTOR ==========
    this.api.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem('token');

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.log('❌ Interceptor - NO hay token disponible');
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // ========== RESPONSE INTERCEPTOR - ✅ CORREGIDO ==========
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError<any>) => {
        // ✅ EXTRAER MENSAJE DE ERROR DEL BACKEND
        let errorMessage = 'Error de conexión con el servidor';
        let errorDetails = null;

        if (error.response) {
          // El servidor respondió con un código de error (4xx, 5xx)
          const data = error.response.data;
          // ✅ EXTRACCIÓN ROBUSTA DEL MENSAJE
          if (data && typeof data === 'object') {
            // 1. Prioridad: campo "message"
            if (data.message) {
              if (Array.isArray(data.message)) {
                // class-validator devuelve array de errores
                errorMessage = data.message[0];
              } else if (typeof data.message === 'string') {
                // NestJS estándar devuelve string
                errorMessage = data.message;
              }
            } 
            // 2. Alternativa: campo "error" (solo si no es genérico)
            else if (data.error && typeof data.error === 'string') {
              const genericErrors = ['Unauthorized', 'Bad Request', 'Forbidden', 'Not Found', 'Internal Server Error'];
              if (!genericErrors.includes(data.error)) {
                errorMessage = data.error;
              } else {
                // Error genérico, usar statusText
                errorMessage = error.response.statusText || 'Error en el servidor';
              }
            }
            // 3. Fallback: statusText
            else {
              errorMessage = error.response.statusText || 'Error en el servidor';
            }
          }

          errorDetails = {
            status: error.response.status,
            statusText: error.response.statusText,
            data: data
          };


          // ✅ MANEJAR ERRORES ESPECÍFICOS POR CÓDIGO DE ESTADO
          switch (error.response.status) {
            case 400:
              console.log('❌ Bad Request (400):', errorMessage);
              if (errorMessage === 'Bad Request') {
                errorMessage = 'Solicitud inválida';
              }
              break;
            case 401:

              console.log('❌ Unauthorized (401):', errorMessage);
              if (errorMessage === 'Unauthorized') {
                errorMessage = 'No autorizado';
              }
             
              // Solo limpiar sesión si es error de token, no de login
              if (errorMessage.toLowerCase().includes('token expired') || 
                  errorMessage.toLowerCase().includes('invalid token') ||
                  errorMessage.toLowerCase().includes('jwt')) {
                sessionStorage.removeItem('token');
                localStorage.removeItem('user');
              }
              break;
            case 403:
              console.log('❌ Forbidden (403):', errorMessage);
              if (errorMessage === 'Forbidden') {
                errorMessage = 'Acceso prohibido';
              }
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
  }

  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

export const apiService = new ApiService();