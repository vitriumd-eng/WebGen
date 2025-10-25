'use client';

import Link from 'next/link';
import OAuthButtons from '@/components/OAuthButtons';
import { FaRocket, FaShieldAlt, FaBolt } from 'react-icons/fa';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left side - Promo */}
        <div className="hidden lg:block space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                AI Креативы
              </span>
            </h1>
            <p className="text-2xl text-text-secondary mb-6">
              Создавайте профессиональные креативы за секунды
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <FaRocket className="text-2xl text-dark-bg" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Быстрый старт</h3>
                <p className="text-text-secondary">
                  Войдите через Telegram или VK за 5 секунд и получите 50 бесплатных кредитов
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Безопасность</h3>
                <p className="text-text-secondary">
                  Никаких паролей! Вход через проверенные социальные сети
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <FaBolt className="text-2xl text-dark-bg" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Мгновенный доступ</h3>
                <p className="text-text-secondary">
                  Начните создавать креативы сразу после входа
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login */}
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-4xl font-bold mb-2">Вход</h1>
            <p className="text-text-secondary">Войдите через социальные сети</p>
          </div>

          <div className="text-center mb-8 hidden lg:block">
            <h2 className="text-3xl font-bold mb-2">Добро пожаловать!</h2>
            <p className="text-text-secondary">Выберите способ входа</p>
          </div>

          <div className="card-elevated">
            <div className="mb-6">
              <OAuthButtons />
            </div>

            <div className="mt-8 p-4 bg-dark-surface rounded-lg border border-dark-border">
              <div className="flex items-start space-x-3">
                <div className="text-accent-primary text-2xl">🎁</div>
                <div>
                  <h4 className="font-semibold mb-1">Бонус при регистрации</h4>
                  <p className="text-sm text-text-secondary">
                    Новые пользователи получают <span className="text-accent-primary font-bold">50 бесплатных кредитов</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-text-secondary text-sm">
                Нет аккаунта?{' '}
                <Link href="/register" className="text-accent-primary hover:underline font-semibold">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-xs">
              Входя в систему, вы соглашаетесь с{' '}
              <Link href="/terms" className="hover:text-accent-primary">
                условиями использования
              </Link>
              {' '}и{' '}
              <Link href="/privacy" className="hover:text-accent-primary">
                политикой конфиденциальности
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
