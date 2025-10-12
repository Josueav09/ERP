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
    return apiService.get<CaptchaResponse>('/auth/captcha');
  },

  async login(credentials: LoginData): Promise<LoginResponse> {
    return apiService.post<LoginResponse>('/auth/login', credentials);
  },

  async verifyEmail(data: VerifyEmailData): Promise<VerifyEmailResponse> {
    return apiService.post<VerifyEmailResponse>('/auth/verify-email', data);
  },

  async logout(): Promise<void> {
    return apiService.post('/auth/logout');
  }
};