// import {
//   createContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import type { ReactNode } from "react";
// import authService from "../services/authService";

// // ---- Tipos ----
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role?: string;
//   permissions?: string[];
//   [key: string]: any;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (
//     email: string,
//     password: string,
//     twoFactorCode?: string,
//     captchaToken?: string
//   ) => Promise<{ success: boolean; user?: User; message?: string }>;
//   logout: () => Promise<void>;
//   hasRole: (roles: string | string[]) => boolean;
//   hasPermission: (permission: string) => boolean;
//   isAuthenticated: boolean;
// }

// interface AuthProviderProps {
//   children: ReactNode;
// }

// // ---- Context ----
// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined
// );

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [sessionTimeout, setSessionTimeout] = useState<ReturnType<
//     typeof setTimeout
//   > | null>(null);

//   // Cargar usuario al iniciar
//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     if (currentUser) {
//       setUser(currentUser);
//       startSessionTimeout();
//     }
//     setLoading(false);
//   }, []);

//   // Iniciar temporizador de sesión
//   const startSessionTimeout = useCallback(() => {
//     if (sessionTimeout) {
//       clearTimeout(sessionTimeout);
//     }

//     const timeout = setTimeout(() => {
//       logout();
//       alert("Sesión cerrada por inactividad");
//     }, Number(import.meta.env.VITE_SESSION_TIMEOUT) || 600000);

//     setSessionTimeout(timeout);
//   }, [sessionTimeout]);

//   // Resetear temporizador en actividad
//   const resetSessionTimeout = useCallback(() => {
//     if (user) {
//       startSessionTimeout();
//     }
//   }, [user, startSessionTimeout]);

//   // Detectar actividad del usuario
//   useEffect(() => {
//     if (user) {
//       const events = ["mousedown", "keydown", "scroll", "touchstart"];

//       events.forEach((event) => {
//         document.addEventListener(event, resetSessionTimeout);
//       });

//       return () => {
//         events.forEach((event) => {
//           document.removeEventListener(event, resetSessionTimeout);
//         });
//       };
//     }
//   }, [user, resetSessionTimeout]);

//   // Login
//   const login = async (
//     email: string,
//     password: string,
//     twoFactorCode?: string,
//     captchaToken?: string
//   ) => {
//     const result = await authService.login(
//       email,
//       password,
//       twoFactorCode,
//       captchaToken
//     );

//     if (result.success && result.user) {
//       setUser(result.user);
//       startSessionTimeout();
//     }

//     return result;
//   };

//   // Logout
//   const logout = async () => {
//     if (sessionTimeout) {
//       clearTimeout(sessionTimeout);
//     }
//     await authService.logout();
//     setUser(null);
//   };

//   // Verificar permisos por rol
//   const hasRole = (roles: string | string[]): boolean => {
//     if (!user) return false;
//     if (Array.isArray(roles)) {
//       return roles.includes(user.role || "");
//     }
//     return user.role === roles;
//   };

//   // Verificar permisos
//   const hasPermission = (permission: string): boolean => {
//     if (!user || !user.permissions) return false;
//     return user.permissions.includes(permission);
//   };

//   const value: AuthContextType = {
//     user,
//     loading,
//     login,
//     logout,
//     hasRole,
//     hasPermission,
//     isAuthenticated: !!user,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useState, useEffect } from 'react';

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, code2FA: string, captcha: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 Mock login sin backend
  const login = async (email: string, password: string, code2FA: string, captcha: string) => {
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        if (captcha.toLowerCase() !== 'erp') {
          resolve({ success: false, message: 'Captcha incorrecto' });
        } else if (code2FA !== '123456') {
          resolve({ success: false, message: 'Código 2FA inválido (usa 123456)' });
        } else if (email && password) {
          const mockUser = { name: 'Josue Ayala', role: 'Admin' };
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'Credenciales inválidas' });
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // 🔹 Mantener sesión si existe en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
