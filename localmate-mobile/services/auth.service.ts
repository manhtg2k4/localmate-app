import api from './api';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from '../constants/api';
import type { AuthResponse, RegisterData } from '../types/auth.types';

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post(ENDPOINTS.AUTH_REGISTER, data);
    return response.data.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post(ENDPOINTS.AUTH_LOGIN, { email, password });
    return response.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post(ENDPOINTS.AUTH_LOGOUT, { refreshToken });
  },

  async getProfile() {
    const response = await api.get(ENDPOINTS.AUTH_ME);
    return response.data.data;
  },

  async updateFcmToken(fcmToken: string): Promise<void> {
    await api.put(ENDPOINTS.USERS_FCM, { fcmToken });
  }
};
