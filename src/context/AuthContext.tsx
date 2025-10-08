import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType, LoginCredentials } from '../types/auth';
import authService from '../services/authService';
import { SECURITY } from '../config/config';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Session timeout in milliseconds (10 minutes)
  const SESSION_TIMEOUT = SECURITY.sessionTimeout; // ya es número, sin parseInt

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          sessionStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Auto-logout on inactivity
  useEffect(() => {
    if (!user) return;

    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        logout();
      }
    }, 60000); // Check every minute

    const updateActivity = () => setLastActivity(Date.now());

    // Track user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      clearInterval(checkInactivity);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [user, lastActivity, SESSION_TIMEOUT]);

  /**
   * Login function
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      setLoading(true);

      // Mock login for development
      // TODO: Replace with actual API call
      const mockUser = authService.mockLogin(credentials.email);

      setUser(mockUser);
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      if (mockUser.refreshToken) {
        sessionStorage.setItem('refreshToken', mockUser.refreshToken);
      }
      setLastActivity(Date.now());

      // Uncomment for production:
      // const response = await authService.login(credentials);
      // setUser(response.data.user);
      // sessionStorage.setItem('user', JSON.stringify(response.data.user));
      // sessionStorage.setItem('refreshToken', response.data.refreshToken);
      // setLastActivity(Date.now());
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('refreshToken');
    }
  }, []);

  /**
   * Refresh token function
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const storedRefreshToken = sessionStorage.getItem('refreshToken');
      if (!storedRefreshToken) throw new Error('No refresh token available');

      // Llamada al servicio
      const response = await authService.refreshToken(storedRefreshToken);

      // Si tu servicio devuelve ApiResponse, extrae `data`
      const data = response.data; // data: { token, refreshToken }

      if (user) {
        const updatedUser = { ...user, token: data.token };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        sessionStorage.setItem('refreshToken', data.refreshToken);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
    }
  }, [user, logout]);
  // Context value
  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;