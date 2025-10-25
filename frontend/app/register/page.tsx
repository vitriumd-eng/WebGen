'use client';

import Link from 'next/link';
import OAuthButtons from '@/components/OAuthButtons';
import { FaGift, FaStar, FaUsers, FaRocket } from 'react-icons/fa';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left side - Benefits */}
        <div className="hidden lg:block space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Начните бесплатно
              </span>
            </h1>
            <p className="text-2xl text-text-secondary mb-6">
              Присоединяйтесь к тысячам довольных пользователей
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <FaGift className="text-2xl text-dark-bg" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">50 кредитов в подарок</h3>
                <p className="text-text-secondary">
                  Получите бесплатные кредиты сразу после регистрации
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center flex-shrink-0">
                <FaStar className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">5+ типов генерации</h3>
                <p className="text-text-secondary">
                  Статичные изображения, GIF, видео-морфинг, AI-скоринг и многое другое
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <FaUsers className="text-2xl text-dark-bg" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Библиотека Top-50</h3>
                <p className="text-text-secondary">
                  Доступ к лучшим креативам и промптам от профессионалов
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center flex-shrink-0">
                <FaRocket className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Гибкие тарифы</h3>
                <p className="text-text-secondary">
                  От бесплатного до корпоративного - выберите свой план
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-accent rounded-xl">
            <div className="flex items-center justify-between text-dark-bg">
              <div>
                <p className="text-sm font-medium opacity-90">Специальное предложение</p>
                <p className="text-2xl font-bold">-15% на первую подписку</p>
              </div>
              <div className="text-5xl">🎉</div>
            </div>
          </div>
        </div>

        {/* Right side - Register */}
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-4xl font-bold mb-2">Регистрация</h1>
            <p className="text-text-secondary">Создайте аккаунт за 5 секунд</p>
          </div>

          <div className="text-center mb-8 hidden lg:block">
            <h2 className="text-3xl font-bold mb-2">Создать аккаунт</h2>
            <p className="text-text-secondary">Выберите способ регистрации</p>
          </div>

          <div className="card-elevated">
            <div className="mb-6">
              <OAuthButtons />
            </div>

            <div className="space-y-4 mt-8">
              <div className="p-4 bg-gradient-accent/10 rounded-lg border border-accent-primary/30">
                <div className="flex items-center space-x-3 mb-2">
                  <FaGift className="text-accent-primary text-xl" />
                  <h4 className="font-bold">Приветственный бонус</h4>
                </div>
                <p className="text-sm text-text-secondary pl-8">
                  <span className="text-accent-primary font-bold">50 кредитов</span> для тестирования всех возможностей платформы
                </p>
              </div>

              <div className="p-4 bg-dark-surface rounded-lg border border-dark-border">
                <h4 className="font-semibold mb-2 text-sm">Что входит в бесплатный план:</h4>
                <ul className="text-xs text-text-secondary space-y-1 pl-4">
                  <li>✓ Базовая генерация изображений</li>
                  <li>✓ Доступ к библиотеке Top-50</li>
                  <li>✓ AI-скоринг креативов</li>
                  <li>✓ Покупка кредитов по мере необходимости</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-text-secondary text-sm">
                Уже есть аккаунт?{' '}
                <Link href="/login" className="text-accent-primary hover:underline font-semibold">
                  Войти
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-xs">
              Регистрируясь, вы соглашаетесь с{' '}
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
