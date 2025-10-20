// frontend/src/types/auth.ts

export type UserRole = 'jefe' | 'ejecutiva' | 'empresa' | 'cliente' | 'Administrador' | 'desarrollador';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
  refreshToken: string;
  avatar?: string;
  phone?: string;
  company?: string;
  position?: string;
  createdAt: string;
  lastLogin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  code2FA?: string;
  captcha: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  requiresEmailVerification?: boolean;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    captchaToken: string,
    captchaResponse: string
  ) => Promise<{
    success: boolean;
    requiresEmailVerification?: boolean;
    email?: string;
    error?: string;
  }>;
  logout: () => void;
  verifyEmailCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  loading: boolean;
  refreshToken: () => Promise<void>;
}