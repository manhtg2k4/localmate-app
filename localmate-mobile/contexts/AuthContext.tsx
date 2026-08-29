import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { authService } from '../services/auth.service';
import type { User, RegisterData } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const profile = await authService.getProfile();
        setUser(profile);
      }
    } catch {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, []);

  const login = async (email: string, password: string) => {
    const { user: u, accessToken, refreshToken } = await authService.login(email, password);
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    setUser(u);

    if (u.role === 'TOURIST') router.replace('/(tourist)');
    else if (u.role === 'GUIDE') router.replace('/(guide)');
    else {
      Alert.alert('Admin Portal', 'Please use the Web Admin Dashboard to log in as Admin.');
      router.replace('/(auth)/login');
    }
  };

  const register = async (data: RegisterData) => {
    const { user: u, accessToken, refreshToken } = await authService.register(data);
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    setUser(u);

    if (u.role === 'TOURIST') router.replace('/(tourist)');
    else router.replace('/(guide)/pending');
  };

  const logout = async () => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (refreshToken) await authService.logout(refreshToken).catch(() => {});
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    setUser(null);
    router.replace('/(auth)/login');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      isAuthenticated: !!user,
      login, register, logout, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
