'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTelegram, FaVk, FaComment } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/lib/toast';

interface OAuthButtonsProps {
  onSuccess?: () => void;
}

export default function OAuthButtons({ onSuccess }: OAuthButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleTelegramLogin = async () => {
    setLoading('telegram');
    
    // Mock Telegram OAuth flow
    // В продакшене здесь будет реальный Telegram Login Widget
    try {
      const mockTelegramData = {
        telegram_id: `${Math.floor(Math.random() * 1000000000)}`,
        first_name: 'Telegram User',
        username: `tg_user_${Date.now()}`,
        photo_url: ''
      };
      
      const response = await api.post('/api/oauth/telegram/callback', mockTelegramData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      showSuccess('Добро пожаловать! Вход выполнен через Telegram');
      if (onSuccess) onSuccess();
      router.push('/generate');
    } catch (error: any) {
      console.error('Telegram login failed', error);
      showError(error.response?.data?.detail || 'Ошибка входа через Telegram');
    } finally {
      setLoading(null);
    }
  };

  const handleVKLogin = async () => {
    setLoading('vk');
    
    // Mock VK OAuth flow
    try {
      const mockVKData = {
        vk_id: `${Math.floor(Math.random() * 1000000000)}`,
        first_name: 'VK',
        last_name: 'User',
        photo_url: ''
      };
      
      const response = await api.post('/api/oauth/vk/callback', mockVKData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      showSuccess('Добро пожаловать! Вход выполнен через VK');
      if (onSuccess) onSuccess();
      router.push('/generate');
    } catch (error: any) {
      console.error('VK login failed', error);
      showError(error.response?.data?.detail || 'Ошибка входа через VK');
    } finally {
      setLoading(null);
    }
  };

  const handleMaxLogin = async () => {
    setLoading('max');
    
    // Mock MAX OAuth flow
    // В продакшене здесь будет реальный MAX OAuth
    try {
      const mockMaxData = {
        max_id: `${Math.floor(Math.random() * 1000000000)}`,
        first_name: 'MAX',
        last_name: 'User',
        phone: '+7900' + Math.floor(Math.random() * 10000000)
      };
      
      const response = await api.post('/api/oauth/max/callback', mockMaxData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      showSuccess('Добро пожаловать! Вход выполнен через MAX');
      if (onSuccess) onSuccess();
      router.push('/generate');
    } catch (error: any) {
      console.error('MAX login failed', error);
      showError(error.response?.data?.detail || 'Ошибка входа через MAX');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleTelegramLogin}
        disabled={loading !== null}
        className="w-full flex items-center justify-center space-x-3 bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
      >
        <FaTelegram className="text-3xl" />
        <span className="text-lg">{loading === 'telegram' ? 'Подключение...' : 'Войти через Telegram'}</span>
      </button>

      <button
        onClick={handleVKLogin}
        disabled={loading !== null}
        className="w-full flex items-center justify-center space-x-3 bg-[#0077FF] hover:bg-[#0066DD] text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
      >
        <FaVk className="text-3xl" />
        <span className="text-lg">{loading === 'vk' ? 'Подключение...' : 'Войти через VK'}</span>
      </button>

      <button
        onClick={handleMaxLogin}
        disabled={loading !== null}
        className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#FF5722] hover:to-[#FF8A00] text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
      >
        <FaComment className="text-3xl" />
        <span className="text-lg">{loading === 'max' ? 'Подключение...' : 'Войти через MAX'}</span>
      </button>
    </div>
  );
}

