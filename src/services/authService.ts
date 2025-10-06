import api from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: any; // Por si tu backend devuelve más campos
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
}

interface LoginAttempts {
  [email: string]: {
    count: number;
    timestamp: number;
  };
}

const authService = {
  // Login con control de intentos fallidos
  login: async (
    email: string,
    password: string,
    twoFactorCode?: string,
    captchaToken?: string
  ): Promise<LoginResult> => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
        twoFactorCode,
        captchaToken,
      });

      const { token, refreshToken, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Resetear intentos fallidos
      authService.resetLoginAttempts(email);

      return { success: true, user };
    } catch (error: any) {
      // Registrar intento fallido
      authService.recordFailedAttempt(email);

      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  },

  // Registro de intentos fallidos (mock)
  recordFailedAttempt: (email: string): void => {
    const attempts: LoginAttempts = JSON.parse(
      localStorage.getItem("loginAttempts") || "{}"
    );
    const userAttempts = attempts[email] || { count: 0, timestamp: Date.now() };

    userAttempts.count += 1;
    userAttempts.timestamp = Date.now();

    attempts[email] = userAttempts;
    localStorage.setItem("loginAttempts", JSON.stringify(attempts));

    // Bloqueo de IP (simulado)
    const ipAttempts = parseInt(localStorage.getItem("ipAttempts") || "0");
    localStorage.setItem("ipAttempts", (ipAttempts + 1).toString());
  },

  // Resetear intentos
  resetLoginAttempts: (email: string): void => {
    const attempts: LoginAttempts = JSON.parse(
      localStorage.getItem("loginAttempts") || "{}"
    );
    delete attempts[email];
    localStorage.setItem("loginAttempts", JSON.stringify(attempts));
    localStorage.setItem("ipAttempts", "0");
  },

  // Verificar si usuario está bloqueado
  isUserBlocked: (email: string): boolean => {
    const attempts: LoginAttempts = JSON.parse(
      localStorage.getItem("loginAttempts") || "{}"
    );
    const userAttempts = attempts[email];

    if (!userAttempts) return false;

    const maxAttempts =
      Number(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS_USER) || 7;
    return userAttempts.count >= maxAttempts;
  },

  // Verificar si IP está bloqueada
  isIpBlocked: (): boolean => {
    const ipAttempts = parseInt(localStorage.getItem("ipAttempts") || "0");
    const maxAttempts = Number(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS_IP) || 5;
    return ipAttempts >= maxAttempts;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? (JSON.parse(user) as User) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await api.post<{ token: string }>("/auth/refresh", {
        refreshToken,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      return token;
    } catch (error) {
      await authService.logout();
      throw error;
    }
  },
};

export default authService;
