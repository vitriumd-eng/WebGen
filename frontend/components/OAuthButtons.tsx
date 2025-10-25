'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTelegram, FaVk, FaGoogle, FaYandex } from 'react-icons/fa';
import { api } from '@/lib/api';

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
      if (onSuccess) onSuccess();
      router.push('/generate');
    } catch (error) {
      console.error('Telegram login failed', error);
      alert('Ошибка входа через Telegram');
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
      if (onSuccess) onSuccess();
      router.push('/generate');
    } catch (error) {
      console.error('VK login failed', error);
      alert('Ошибка входа через VK');
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading('google');
    
    // Mock Google OAuth flow
    try {
      const mockGoogleData = {
        google_id: `${Math.floor(Math.random() * 1000000000)}`,
        email: `user${Date.now()}@gmail.com`,
        name: 'Google User',
        picture: ''
      };
      
      const response = await api.post('/api/oauth/google/callback', mockGoogleData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      if (onSuccess) onSuccess();
      router.push('/generate');
    } catch (error) {
      console.error('Google login failed', error);
      alert('Ошибка входа через Google');
    } finally {
      setLoading(null);
    }
  };

  const handleYandexLogin = async () => {
    setLoading('yandex');
    
    // Mock Yandex OAuth flow
    try {
      const mockYandexData = {
        yandex_id: `${Math.floor(Math.random() * 1000000000)}`,
        email: `user${Date.now()}@yandex.ru`,
        display_name: 'Яндекс Пользователь'
      };
      
      const response = await api.post('/api/oauth/yandex/callback', mockYandexData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      if (onSuccess) onSuccess();
      router.push('/generate');
    } catch (error) {
      console.error('Yandex login failed', error);
      alert('Ошибка входа через Яндекс');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleTelegramLogin}
        disabled={loading !== null}
        className="w-full flex items-center justify-center space-x-3 bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
      >
        <FaTelegram className="text-2xl" />
        <span>{loading === 'telegram' ? 'Вход...' : 'Войти через Telegram'}</span>
      </button>

      <button
        onClick={handleVKLogin}
        disabled={loading !== null}
        className="w-full flex items-center justify-center space-x-3 bg-[#0077FF] hover:bg-[#0066DD] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
      >
        <FaVk className="text-2xl" />
        <span>{loading === 'vk' ? 'Вход...' : 'Войти через VK'}</span>
      </button>

      <button
        onClick={handleGoogleLogin}
        disabled={loading !== null}
        className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
      >
        <FaGoogle className="text-2xl text-[#DB4437]" />
        <span>{loading === 'google' ? 'Вход...' : 'Войти через Google'}</span>
      </button>

      <button
        onClick={handleYandexLogin}
        disabled={loading !== null}
        className="w-full flex items-center justify-center space-x-3 bg-[#FC3F1D] hover:bg-[#E63600] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
      >
        <FaYandex className="text-2xl" />
        <span>{loading === 'yandex' ? 'Вход...' : 'Войти через Яндекс'}</span>
      </button>
    </div>
  );
}

