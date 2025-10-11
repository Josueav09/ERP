// // ✅ src/context/AuthContext.tsx
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { User, AuthContextType, LoginCredentials } from "../types/auth";
// import authService from "../services/authService";
// import { SECURITY } from "../config/config";

// // ========================
// // CONFIGURACIONES GENERALES
// // ========================
// const INACTIVITY_TIMEOUT = SECURITY.sessionTimeout;
// const MAX_USER_ATTEMPTS = SECURITY.maxLoginAttempts;
// const MAX_IP_ATTEMPTS = SECURITY.maxIPAttempts;
// const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutos

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

// interface AuthProviderProps {
//   children: React.ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [pendingUser, setPendingUser] = useState<User | null>(null);
//   const [lastActivity, setLastActivity] = useState(Date.now());
//   const navigate = useNavigate();

//   // ========================
//   // INTENTOS DE LOGIN
//   // ========================
//   const getLoginAttempts = useCallback((key: string) => {
//     const stored = localStorage.getItem(`login_attempts_${key}`);
//     if (!stored) return { count: 0, lastAttempt: 0 };
//     return JSON.parse(stored);
//   }, []);

//   const setLoginAttempts = useCallback((key: string, attempts: { count: number; lastAttempt: number }) => {
//     localStorage.setItem(`login_attempts_${key}`, JSON.stringify(attempts));
//   }, []);

//   const checkLoginAttempts = useCallback(
//     (email: string) => {
//       const userAttempts = getLoginAttempts(`user_${email}`);
//       const ipAttempts = getLoginAttempts("ip_current");
//       const now = Date.now();

//       if (now - userAttempts.lastAttempt > BLOCK_DURATION) userAttempts.count = 0;
//       if (now - ipAttempts.lastAttempt > BLOCK_DURATION) ipAttempts.count = 0;

//       const userBlocked = userAttempts.count >= MAX_USER_ATTEMPTS;
//       const ipBlocked = ipAttempts.count >= MAX_IP_ATTEMPTS;

//       return {
//         blocked: userBlocked || ipBlocked,
//         remainingAttempts: MAX_USER_ATTEMPTS - userAttempts.count,
//         ipRemainingAttempts: MAX_IP_ATTEMPTS - ipAttempts.count,
//       };
//     },
//     [getLoginAttempts]
//   );

//   const recordFailedAttempt = useCallback(
//     (email: string) => {
//       const userAttempts = getLoginAttempts(`user_${email}`);
//       const ipAttempts = getLoginAttempts("ip_current");
//       const now = Date.now();

//       setLoginAttempts(`user_${email}`, { count: userAttempts.count + 1, lastAttempt: now });
//       setLoginAttempts("ip_current", { count: ipAttempts.count + 1, lastAttempt: now });
//     },
//     [getLoginAttempts, setLoginAttempts]
//   );

//   const clearLoginAttempts = useCallback((email: string) => {
//     localStorage.removeItem(`login_attempts_user_${email}`);
//     localStorage.removeItem("login_attempts_ip_current");
//   }, []);

//   // ========================
//   // CARGAR SESIÓN GUARDADA
//   // ========================
//   useEffect(() => {
//     const initAuth = () => {
//       const storedUser = localStorage.getItem("user");
//       const sessionExpiry = localStorage.getItem("session_expiry");

//       if (storedUser && sessionExpiry) {
//         const expiry = Number(sessionExpiry);
//         if (Date.now() < expiry) {
//           setUser(JSON.parse(storedUser));
//         } else {
//           localStorage.removeItem("user");
//           localStorage.removeItem("session_expiry");
//         }
//       }
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   // ========================
//   // AUTO LOGOUT POR INACTIVIDAD
//   // ========================
//   useEffect(() => {
//     if (!user) return;

//     const checkInactivity = setInterval(() => {
//       if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
//         logout();
//       }
//     }, 60000); // 1 min

//     const updateActivity = () => setLastActivity(Date.now());
//     ["mousemove", "keypress", "click", "scroll"].forEach((e) =>
//       window.addEventListener(e, updateActivity)
//     );

//     return () => {
//       clearInterval(checkInactivity);
//       ["mousemove", "keypress", "click", "scroll"].forEach((e) =>
//         window.removeEventListener(e, updateActivity)
//       );
//     };
//   }, [user, lastActivity]);

//   // ========================
//   // LOGIN
//   // ========================
//   const login = async (email: string, password: string, captchaToken: string) => {
//     try {
//       const attemptCheck = checkLoginAttempts(email);
//       if (attemptCheck.blocked) {
//         return { success: false, error: "Cuenta bloqueada. Intente en 30 minutos." };
//       }

//       if (!captchaToken) {
//         return { success: false, error: "Debe completar el captcha." };
//       }

//       setLoading(true);
//       const response = await authService.login({ email, password, code2FA: "", captcha: captchaToken });

//       if (!response.success) {
//         recordFailedAttempt(email);
//         const remaining = checkLoginAttempts(email);
//         const ipWarning =
//           remaining.ipRemainingAttempts <= 2
//             ? ` ADVERTENCIA: IP bloqueada en ${remaining.ipRemainingAttempts} intentos más.`
//             : "";
//         return {
//           success: false,
//           error: `${response.message || "Credenciales inválidas."} ${remaining.remainingAttempts} intentos restantes.${ipWarning}`,
//         };
//       }

//       const { user: loggedUser, token, refreshToken } = response.data;
//       clearLoginAttempts(email);

//       localStorage.setItem("user", JSON.stringify(loggedUser));
//       localStorage.setItem("session_expiry", (Date.now() + 24 * 60 * 60 * 1000).toString());
//       sessionStorage.setItem("token", token);
//       sessionStorage.setItem("refreshToken", refreshToken);

//       setUser(loggedUser);

//       // Redirección por rol
//       setTimeout(() => {
//         switch (loggedUser.role) {
//           case "jefe":
//             navigate("/dashboard/jefe");
//             break;
//           case "ejecutiva":
//             navigate("/dashboard/ejecutiva");
//             break;
//           case "cliente":
//             navigate("/dashboard/cliente");
//             break;
//           default:
//             navigate("/dashboard");
//         }
//       }, 300);

//       return { success: true };
//     } catch (error) {
//       console.error("Login error:", error);
//       return { success: false, error: "Error al conectar con el servidor." };
//     } finally {
//       setLoading(false);
//     }
//   };



//   // ========================
//   // LOGOUT
//   // ========================
//   const logout = useCallback(async () => {
//     try {
//       await authService.logout();
//     } catch {
//       // aun si falla, limpiamos sesión
//     } finally {
//       setUser(null);
//       setPendingUser(null);
//       localStorage.removeItem("user");
//       localStorage.removeItem("session_expiry");
//       sessionStorage.removeItem("token");
//       sessionStorage.removeItem("refreshToken");
//       navigate("/login");
//     }
//   }, [navigate]);


//   // ========================
//   // CONTEXTO FINAL
//   // ========================
//   const value: AuthContextType = {
//     user,
//     login,
//     logout,
//     verifyEmailCode: async () => ({ success: true }), // opcional si tu backend no usa código email
//     isAuthenticated: !!user,
//     loading,
//     refreshToken: async () => {
//       console.log("Token refreshed");
//     },
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthContext;


// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User, AuthContextType } from "../types/auth";
import { SECURITY } from "../config/config";

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
  const [pendingUser, setPendingUser] = useState<any>(null); // usuario pendiente de verificación
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();

  // ========================
  // INTENTOS DE LOGIN
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
  // LOGIN
  // ========================
  // const login = async (
  //   email: string,
  //   password: string,
  //   captchaToken: string,
  //   captchaResponse: string // ✅ nuevo parámetro
  // ) => {
  //   try {
  //     const attemptCheck = checkLoginAttempts(email);
  //     if (attemptCheck.blocked) {
  //       return { success: false, error: "Cuenta bloqueada. Intente en 30 minutos." };
  //     }

  //     if (!captchaToken || !captchaResponse) {
  //       return { success: false, error: "Debe completar el captcha." };
  //     }

  //     setLoading(true);

  //     // ✅ Llamada al backend con captchaToken y captchaResponse
  //     const response = await fetch("/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //         captchaToken,
  //         captchaResponse, // ✅ enviar la respuesta del usuario
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok || !data.success) {
  //       recordFailedAttempt(email);
  //       const remaining = checkLoginAttempts(email);
  //       const ipWarning =
  //         remaining.ipRemainingAttempts <= 2
  //           ? ` ADVERTENCIA: IP bloqueada en ${remaining.ipRemainingAttempts} intentos más.`
  //           : "";
  //       return {
  //         success: false,
  //         error: `${data.message || data.error || "Credenciales inválidas."} ${remaining.remainingAttempts} intentos restantes.${ipWarning}`,
  //       };
  //     }

  //     clearLoginAttempts(email);

  //     // ✅ Si requiere verificación de email
  //     if (data.requiresEmailVerification) {
  //       setPendingUser(data); // guardar datos temporalmente
  //       return {
  //         success: true,
  //         requiresEmailVerification: true,
  //         email: data.email,
  //       };
  //     }

  //     // Si no requiere verificación (no debería pasar)
  //     return { success: true };
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     return { success: false, error: "Error al conectar con el servidor." };
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const login = async (
  email: string,
  password: string,
  captchaToken: string,
  captchaResponse: string
) => {
  try {
    const attemptCheck = checkLoginAttempts(email);
    if (attemptCheck.blocked) {
      return { success: false, error: "Cuenta bloqueada. Intente en 30 minutos." };
    }

    if (!captchaToken || !captchaResponse) {
      return { success: false, error: "Debe completar el captcha." };
    }

    setLoading(true);

    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        captchaToken,
        captchaResponse,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      recordFailedAttempt(email);
      const remaining = checkLoginAttempts(email);
      const ipWarning =
        remaining.ipRemainingAttempts <= 2
          ? ` ADVERTENCIA: IP bloqueada en ${remaining.ipRemainingAttempts} intentos más.`
          : "";
      return {
        success: false,
        error: `${data.message || data.error || "Credenciales inválidas."} ${remaining.remainingAttempts} intentos restantes.${ipWarning}`,
      };
    }

    clearLoginAttempts(email);

    // ✅ CORRECCIÓN: Guardar toda la información del usuario pendiente
    if (data.requiresEmailVerification) {
      console.log("🔐 Setting pending user for email verification:", data.email);
      setPendingUser({
        email: data.email,
        userId: data.userId,
        name: data.name,
        rol: data.rol
      });
      
      // ✅ NO llamar setLoading(false) aquí - el LoginPage necesita mantener el estado
      return {
        success: true,
        requiresEmailVerification: true,
        email: data.email,
        userData: data
      };
    }

    // ✅ Solo llamar setLoading(false) para casos de éxito sin verificación
    setLoading(false);
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    setLoading(false); // ✅ Solo en catch
    return { success: false, error: "Error al conectar con el servidor." };
  }
  // ❌ ELIMINAR el finally block que causa el problema
};



  // ========================
  // VERIFICAR CÓDIGO EMAIL
  // ========================
  // const verifyEmailCode = async (code: string) => {
  //   try {
  //     if (!pendingUser) {
  //       return { success: false, error: "No hay sesión pendiente" };
  //     }

  //     const response = await fetch("/auth/verify-email", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email: pendingUser.email,
  //         code,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok || !data.success) {
  //       return {
  //         success: false,
  //         error: data.error || "Código inválido",
  //       };
  //     }

  //     // ✅ Guardar usuario y token
  //     const loggedUser: User = {
  //       id: data.userId.toString(),
  //       email: data.email,
  //       name: data.name,
  //       role: data.rol,
  //       token: data.accessToken,
  //       refreshToken: data.accessToken, // en producción debería ser un refresh token diferente
  //       avatar: "",
  //       phone: "",
  //       company: "",
  //       position: "",
  //       createdAt: new Date().toISOString(),
  //       lastLogin: new Date().toISOString(),
  //     };

  //     setUser(loggedUser);
  //     localStorage.setItem("user", JSON.stringify(loggedUser));
  //     sessionStorage.setItem("token", data.accessToken);
  //     setPendingUser(null);

  //     // Redirigir según rol
  //     setTimeout(() => {
  //       switch (data.rol) {
  //         case "jefe":
  //           navigate("/dashboard");
  //           break;
  //         case "ejecutiva":
  //           navigate("/dashboard/ejecutiva");
  //           break;
  //         case "cliente":
  //           navigate("/dashboard/cliente");
  //           break;
  //         default:
  //           navigate("/dashboard");
  //       }
  //     }, 300);

  //     return { success: true };
  //   } catch (error) {
  //     console.error("Verify code error:", error);
  //     return {
  //       success: false,
  //       error: "Error al verificar código",
  //     };
  //   }
  // };

  const verifyEmailCode = async (code: string) => {
  try {
    if (!pendingUser) {
      return { success: false, error: "No hay sesión pendiente" };
    }

    const response = await fetch("/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: pendingUser.email,
        code,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Código inválido",
      };
    }

    // ✅ CORREGIR: Guardar usuario y token correctamente
    const loggedUser: User = {
      id: data.userId.toString(),
      email: data.email,
      name: data.name,
      role: data.rol,
      token: data.accessToken,
      refreshToken: data.accessToken,
      avatar: "",
      phone: "",
      company: "",
      position: "",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    sessionStorage.setItem("token", data.accessToken);
    setPendingUser(null);
    
    // ✅ IMPORTANTE: Actualizar loading state
    setLoading(false);

    // Redirigir según rol
    setTimeout(() => {
      switch (data.rol) {
        case "jefe":
          navigate("/dashboard/jefe");
          break;
        case "ejecutiva":
          navigate("/dashboard/ejecutiva");
          break;
        case "cliente":
          navigate("/dashboard/cliente");
          break;
        default:
          navigate("/dashboard");
      }
    }, 300);

    return { success: true };
  } catch (error) {
    console.error("Verify code error:", error);
    return {
      success: false,
      error: "Error al verificar código",
    };
  }
};



  // ========================
  // LOGOUT
  // ========================
  const logout = useCallback(async () => {
    try {
      await fetch("/auth/logout", { method: "POST" });
    } catch {
      // Si falla, igual limpiar sesión local
    } finally {
      setUser(null);
      setPendingUser(null);
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      navigate("/login");
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
      console.log("Token refreshed");
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;