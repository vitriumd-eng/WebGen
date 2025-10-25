'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { User } from '@/lib/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);
      const { access_token } = response.data;
      // Token теперь в cookie, но сохраняем в localStorage для обратной совместимости
      localStorage.setItem('token', access_token);
      const userResponse = await authAPI.getCurrentUser();
      setUser(userResponse.data);
      toast.success('Вход выполнен успешно!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка входа';
      toast.error(message);
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string, fullName?: string) => {
    try {
      await authAPI.register({ email, username, password, full_name: fullName });
      toast.success('Регистрация успешна! Добро пожаловать!');
      await login(username, password);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка регистрации';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();  // Удаляем cookie на сервере
      toast.success('Вы вышли из системы');
    } catch (error) {
      console.error('Logout error', error);
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user', error);
      toast.error('Не удалось обновить данные пользователя');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

