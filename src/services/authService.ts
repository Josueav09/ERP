// import { apiService } from './api';

// export interface LoginData {
//   email: string;
//   password: string;
//   captchaToken: string;
//   captchaResponse: string;
// }

// export interface LoginResponse {
//   success: boolean;
//   requiresEmailVerification?: boolean;
//   email?: string;
//   userId?: number;
//   rol?: string;
//   name?: string;
//   error?: string;
//   message?: string;
// }

// export interface VerifyEmailData {
//   email: string;
//   code: string;
// }

// export interface VerifyEmailResponse {
//   success: boolean;
//   userId?: number;
//   email?: string;
//   rol?: string;
//   name?: string;
//   accessToken?: string;
//   error?: string;
// }

// export interface CaptchaResponse {
//   captchaText: string;
//   captchaToken: string;
// }

// export const authService = {
//   async getCaptcha(): Promise<CaptchaResponse> {
//     return apiService.get<CaptchaResponse>('/auth/captcha');
//   },

//   async login(credentials: LoginData): Promise<LoginResponse> {
//     return apiService.post<LoginResponse>('/auth/login', credentials);
//   },

//   async verifyEmail(data: VerifyEmailData): Promise<VerifyEmailResponse> {
//     return apiService.post<VerifyEmailResponse>('/auth/verify-email', data);
//   },

//   async logout(): Promise<void> {
//     return apiService.post('/auth/logout');
//   }
// };

// frontend/src/services/authService.ts
import { apiService } from './api';

export interface LoginData {
  email: string;
  password: string;
  captchaToken: string;
  captchaResponse: string;
}

export interface LoginResponse {
  success: boolean;
  requiresEmailVerification?: boolean;
  email?: string;
  userId?: number;
  rol?: string;
  name?: string;
  error?: string;
  message?: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  userId?: number;
  email?: string;
  rol?: string;
  name?: string;
  accessToken?: string;
  error?: string;
}

export interface CaptchaResponse {
  captchaText: string;
  captchaToken: string;
}

export const authService = {
  async getCaptcha(): Promise<CaptchaResponse> {
    try {
      return await apiService.get<CaptchaResponse>('/auth/captcha');
    } catch (error: any) {
      console.error('Error obteniendo captcha:', error);
      throw new Error(error.message || 'Error al generar captcha');
    }
  },

  async login(credentials: LoginData): Promise<LoginResponse> {
    try {
      return await apiService.post<LoginResponse>('/auth/login', credentials);
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // ✅ Retornar error estructurado
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión',
        message: error.message || 'Error al iniciar sesión'
      };
    }
  },

  async verifyEmail(data: VerifyEmailData): Promise<VerifyEmailResponse> {
    try {
      return await apiService.post<VerifyEmailResponse>('/auth/verify-email', data);
    } catch (error: any) {
      console.error('Error verificando email:', error);
      
      return {
        success: false,
        error: error.message || 'Error al verificar código'
      };
    }
  },

  async logout(): Promise<void> {
    try {
      return await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }
};