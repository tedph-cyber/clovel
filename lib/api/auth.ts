import { apiClient, handleApiResponse } from './client';
import { API_ROUTES } from '../constants/routes';
import type { 
  User,
  ApiResponse 
} from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export class AuthApi {
  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.AUTH_LOGIN,
      credentials
    );
    return handleApiResponse(response) as AuthResponse;
  }

  // Register new user
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.AUTH_REGISTER,
      data
    );
    return handleApiResponse(response) as AuthResponse;
  }

  // Logout user
  static async logout(): Promise<void> {
    await apiClient.post(API_ROUTES.AUTH_LOGOUT);
  }

  // Get current user profile
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ROUTES.AUTH_PROFILE
    );
    return handleApiResponse(response) as User;
  }

  // Update user profile
  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ROUTES.AUTH_PROFILE,
      data
    );
    return handleApiResponse(response) as User;
  }

  // Change password
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    await apiClient.post(`${API_ROUTES.AUTH_PROFILE}/password`, data);
  }

  // Reset password request
  static async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post(`${API_ROUTES.AUTH_LOGIN}/reset-password`, { email });
  }

  // Reset password with token
  static async resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    await apiClient.post(`${API_ROUTES.AUTH_LOGIN}/reset-password/confirm`, data);
  }

  // Verify email
  static async verifyEmail(token: string): Promise<void> {
    await apiClient.post(`${API_ROUTES.AUTH_REGISTER}/verify-email`, { token });
  }

  // Resend verification email
  static async resendVerificationEmail(): Promise<void> {
    await apiClient.post(`${API_ROUTES.AUTH_REGISTER}/resend-verification`);
  }

  // Refresh authentication token
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      `${API_ROUTES.AUTH_LOGIN}/refresh`,
      { refreshToken }
    );
    return handleApiResponse(response) as AuthResponse;
  }

  // Get user reading list
  static async getReadingList(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      API_ROUTES.USER_READING_LIST
    );
    return handleApiResponse(response) as any[];
  }

  // Get user library
  static async getLibrary(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      API_ROUTES.USER_LIBRARY
    );
    return handleApiResponse(response) as any[];
  }

  // Get user bookmarks
  static async getBookmarks(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      API_ROUTES.USER_BOOKMARKS
    );
    return handleApiResponse(response) as any[];
  }

  // Get user reading progress
  static async getReadingProgress(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      API_ROUTES.USER_PROGRESS
    );
    return handleApiResponse(response) as any[];
  }
}

export const authApi = AuthApi;