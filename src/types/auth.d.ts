export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenant?: string;
  token: string;
  refreshToken?: string;
  avatar?: string;
  phone?: string;
  company?: string;
  position?: string;
  linkedIn?: string;
  createdAt?: string;
  lastLogin?: string;
}

export type UserRole = 'cliente' | 'ejecutiva' | 'jefe' | 'desarrollador' | 'admin';

export interface LoginCredentials {
  email: string;
  password: string;
  code2FA: string;
  captcha?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  refreshToken: () => Promise<void>;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}