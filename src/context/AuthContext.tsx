import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User, AuthContextType } from "../types/auth";
import { SECURITY } from "../config/config";
import { authService, LoginData, VerifyEmailData } from "@/services/authService";

const INACTIVITY_TIMEOUT = SECURITY.sessionTimeout;
const MAX_USER_ATTEMPTS = SECURITY.maxLoginAttempts;
const MAX_IP_ATTEMPTS = SECURITY.maxIPAttempts;
const BLOCK_DURATION = 30 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}




export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();

  // ========================
  // INTENTOS DE LOGIN (MANTENIENDO TU LÓGICA)
  // ========================
  const getLoginAttempts = useCallback((key: string) => {
    const stored = localStorage.getItem(`login_attempts_${key}`);
    if (!stored) return { count: 0, lastAttempt: 0 };
    return JSON.parse(stored);
  }, []);

  const setLoginAttempts = useCallback((key: string, attempts: { count: number; lastAttempt: number }) => {
    localStorage.setItem(`login_attempts_${key}`, JSON.stringify(attempts));
  }, []);

  const checkLoginAttempts = useCallback(
    (email: string) => {
      const userAttempts = getLoginAttempts(`user_${email}`);
      const ipAttempts = getLoginAttempts("ip_current");
      const now = Date.now();

      if (now - userAttempts.lastAttempt > BLOCK_DURATION) userAttempts.count = 0;
      if (now - ipAttempts.lastAttempt > BLOCK_DURATION) ipAttempts.count = 0;

      const userBlocked = userAttempts.count >= MAX_USER_ATTEMPTS;
      const ipBlocked = ipAttempts.count >= MAX_IP_ATTEMPTS;

      return {
        blocked: userBlocked || ipBlocked,
        remainingAttempts: MAX_USER_ATTEMPTS - userAttempts.count,
        ipRemainingAttempts: MAX_IP_ATTEMPTS - ipAttempts.count,
      };
    },
    [getLoginAttempts]
  );

  const recordFailedAttempt = useCallback(
    (email: string) => {
      const userAttempts = getLoginAttempts(`user_${email}`);
      const ipAttempts = getLoginAttempts("ip_current");
      const now = Date.now();

      setLoginAttempts(`user_${email}`, { count: userAttempts.count + 1, lastAttempt: now });
      setLoginAttempts("ip_current", { count: ipAttempts.count + 1, lastAttempt: now });
    },
    [getLoginAttempts, setLoginAttempts]
  );

  const clearLoginAttempts = useCallback((email: string) => {
    localStorage.removeItem(`login_attempts_user_${email}`);
    localStorage.removeItem("login_attempts_ip_current");
  }, []);

  // ========================
  // CARGAR SESIÓN GUARDADA
  // ========================
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = sessionStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);



  // ========================
  // AUTO LOGOUT POR INACTIVIDAD
  // ========================
  useEffect(() => {
    if (!user) return;

    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        logout();
      }
    }, 60000);

    const updateActivity = () => setLastActivity(Date.now());
    ["mousemove", "keypress", "click", "scroll"].forEach((e) =>
      window.addEventListener(e, updateActivity)
    );

    return () => {
      clearInterval(checkInactivity);
      ["mousemove", "keypress", "click", "scroll"].forEach((e) =>
        window.removeEventListener(e, updateActivity)
      );
    };
  }, [user, lastActivity]);


  // ========================
  // LOGIN - CORREGIDO CON SERVICIOS
  // ======================== 

  // En tu AuthContext, agrega este useEffect para debug
  useEffect(() => {
    console.log('🔐 AuthContext - User state ACTUALIZADO:', user);
  }, [user]); // ← Se ejecuta cada vez que user cambia

  const login = async (
    email: string,
    password: string,
    captchaToken: string,
    captchaResponse: string
  ) => {
    try {
      const attemptCheck = checkLoginAttempts(email);

      // if (attemptCheck.blocked) {
      //   return {
      //     success: false,
      //     error: "Cuenta bloqueada temporalmente. Intente en 30 minutos."
      //   };
      // }

      if (!captchaToken || !captchaResponse) {
        return {
          success: false,
          error: "Debe completar el captcha de seguridad"
        };
      }

      setLoading(true);

      const loginData: LoginData = {
        email,
        password,
        captchaToken,
        captchaResponse,
      };

      // ✅ authService ya maneja los errores y retorna success: false
      const data = await authService.login(loginData);

      if (!data.success) {
        recordFailedAttempt(email);
        const remaining = checkLoginAttempts(email);

        // ✅ Usar el mensaje de error del backend directamente
        return {
          success: false,
          error: data.error || data.message || "Error al iniciar sesión"
        };
      }

      clearLoginAttempts(email);

      if (data.requiresEmailVerification) {
        setPendingUser({
          email: data.email,
          userId: data.userId,
          name: data.name,
          rol: data.rol
        });

        setLoading(false);
        return {
          success: true,
          requiresEmailVerification: true,
          email: data.email,
          userData: data
        };
      }

      setLoading(false);
      return { success: true };

    } catch (error: any) {
      recordFailedAttempt(email);
      setLoading(false);

      return {
        success: false,
        error: error.message || "Error de conexión con el servidor"
      };
    }
  };


  const verifyEmailCode = async (code: string) => {
    try {
      if (!pendingUser) {
        return { success: false, error: "No hay sesión pendiente" };
      }

      const verifyData: VerifyEmailData = {
        email: pendingUser.email,
        code,
      };

      const data = await authService.verifyEmail(verifyData);

      if (!data.success) {
        return {
          success: false,
          error: data.error || "Código inválido",
        };
      }

      if (!data.accessToken) {
        return { success: false, error: "Error de autenticación" };
      }


      // ✅ Guardar usuario y token correctamente
      const loggedUser: User = {
        id: data.userId?.toString() || '',
        email: data.email || '',
        name: data.name || '',
        role: data.rol as any || 'cliente',
        token: data.accessToken || '',
        refreshToken: data.accessToken || '',
        avatar: "",
        phone: "",
        company: "",
        position: "",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };


      // ✅ GUARDAR PRIMERO
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      sessionStorage.setItem("token", data.accessToken || '');
      setPendingUser(null);

      // ✅ VERIFICAR DESPUÉS con setTimeout para dar tiempo a React
      setTimeout(() => {
      }, 0);

      // ✅ REDIRECCIÓN con más tiempo para que el contexto se actualice
      setTimeout(() => {

        if (data.rol === "jefe" || data.rol === "Jefe" || data.rol === "Administrador") {
          navigate("/dashboard/jefe", { replace: true });
        }
        else if (data.rol === "ejecutiva") {
          navigate("/dashboard/ejecutiva", { replace: true });
        }
        else if (data.rol === "empresa") {
          navigate("/dashboard/empresa", { replace: true });
        }
        else if (data.rol === "cliente") {
          navigate("/dashboard/cliente", { replace: true });
        }
        else {
          navigate("/login", { replace: true });
        }
      }, 200); // ✅ Aumentar el tiempo para dar chance al contexto

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al verificar código",
      };
    }
  };

  const logout = useCallback(async () => {
    try {
      // 1️⃣ Intentar logout en el backend
      await authService.logout();
    } catch (error) {
      // ✅ Continuar con limpieza local incluso si falla el servidor
    } finally {
      // 2️⃣ LIMPIEZA LOCAL GARANTIZADA
      setUser(null);
      setPendingUser(null);

      // Limpiar todo el almacenamiento local
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");

      // Limpiar cualquier otro dato de sesión
      localStorage.removeItem("pendingLogin");
      sessionStorage.removeItem("loginAttempts");


      // 3️⃣ Redirigir al login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ========================
  // CONTEXTO FINAL
  // ========================
  const value: AuthContextType = {
    user,
    login,
    logout,
    verifyEmailCode,
    isAuthenticated: !!user,
    loading,
    refreshToken: async () => {
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;