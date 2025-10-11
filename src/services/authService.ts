// import api, { handleApiResponse, handleApiError } from './api';
// import { LoginCredentials, LoginResponse, User } from '../types/auth';
// import { ApiResponse } from '../types/api';

// class AuthService {
//   private readonly BASE_URL = '/auth';

//   /**
//    * Login user
//    */
//   async login(credentials: LoginCredentials): Promise<LoginResponse> {
//     try {
//       const response = await api.post(`${this.BASE_URL}/login`, credentials);
//       return handleApiResponse<LoginResponse>(response);
//     } catch (error) {
//       return handleApiError(error);
//     }
//   }

//   /**
//    * Logout user
//    */
//   async logout(): Promise<void> {
//     try {
//       await api.post(`${this.BASE_URL}/logout`);
//     } catch (error) {
//       // Even if logout fails on server, clear local storage
//       console.error('Logout error:', error);
//     } finally {
//       sessionStorage.removeItem('user');
//       sessionStorage.removeItem('refreshToken');
//     }
//   }

//   /**
//    * Refresh access token
//    */
//   async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
//     try {
//       const response = await api.post(`${this.BASE_URL}/refresh`, { refreshToken });
//       return handleApiResponse<{ token: string; refreshToken: string }>(response);
//     } catch (error) {
//       return handleApiError(error);
//     }
//   }


//   /**
//    * Verify 2FA code
//    */
//   async verify2FA(userId: string, code: string): Promise<ApiResponse<{ verified: boolean }>> {
//     try {
//       const response = await api.post(`${this.BASE_URL}/verify-2fa`, { userId, code });
//       return handleApiResponse(response);
//     } catch (error) {
//       return handleApiError(error);
//     }
//   }

//   /**
//    * Request password reset
//    */
//   async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
//     try {
//       const response = await api.post(`${this.BASE_URL}/password-reset/request`, { email });
//       return handleApiResponse(response);
//     } catch (error) {
//       return handleApiError(error);
//     }
//   }

//   /**
//    * Reset password
//    */
//   async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
//     try {
//       const response = await api.post(`${this.BASE_URL}/password-reset/confirm`, {
//         token,
//         newPassword,
//       });
//       return handleApiResponse(response);
//     } catch (error) {
//       return handleApiError(error);
//     }
//   }

//   /**
//    * Get current user profile
//    */
//   async getCurrentUser(): Promise<ApiResponse<User>> {
//     try {
//       const response = await api.get(`${this.BASE_URL}/me`);
//       return handleApiResponse(response);
//     } catch (error) {
//       return handleApiError(error);
//     }
//   }

//   /**
//    * Update current user profile
//    */
//   async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
//     try {
//       const response = await api.put(`${this.BASE_URL}/me`, data);
//       return handleApiResponse(response);
//     } catch (error) {
//       return handleApiError(error);
//     }
//   }

//   /**
//    * Change password
//    */
//   async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
//     try {
//       const response = await api.post(`${this.BASE_URL}/change-password`, {
//         currentPassword,
//         newPassword,
//       });
//       return handleApiResponse(response);
//     } catch (error) {
//       return handleApiError(error);
//     }
//   }

//   /**
//    * Mock login for development (remove in production)
//    */
//   mockLogin(email: string): User {
//     return {
//       id: '1',
//       email,
//       name: 'Usuario Demo',
//       role: 'admin',
//       token: 'mock-jwt-token-' + Date.now(),
//       refreshToken: 'mock-refresh-token-' + Date.now(),
//       avatar: '',
//       phone: '+51 999 999 999',
//       company: 'Empresa Demo',
//       position: 'Administrador',
//       createdAt: new Date().toISOString(),
//       lastLogin: new Date().toISOString(),
//     };
//   }
// }

// export default new AuthService();



