'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaImage, FaVideo, FaChartLine, FaRocket, FaStar, FaCheck } from 'react-icons/fa';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-radial from-accent-primary/10 via-transparent to-transparent animate-pulse-slow"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              AI-Генератор Креативов
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Создавайте профессиональные креативы для таргетированной рекламы за секунды с помощью искусственного интеллекта
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/generate" className="btn btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 animate-glow">
                <FaRocket />
                <span>Начать создавать</span>
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 animate-glow">
                  <FaRocket />
                  <span>Начать бесплатно</span>
                </Link>
                <Link href="/pricing" className="btn btn-secondary text-lg px-8 py-4">
                  Посмотреть тарифы
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-accent-primary">5+</div>
              <div className="text-text-secondary mt-2">Типов генерации</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-secondary">99%</div>
              <div className="text-text-secondary mt-2">Удовлетворенность</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-purple">24/7</div>
              <div className="text-text-secondary mt-2">Доступность</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-dark-surface">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Возможности платформы
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-elevated group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 group-hover:shadow-neon transition-shadow">
                <FaImage className="text-3xl text-dark-bg" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Статичные изображения</h3>
              <p className="text-text-secondary">
                Создавайте высококачественные статичные креативы для соцсетей и рекламных площадок
              </p>
              <div className="mt-4 flex items-center text-accent-primary">
                <span className="font-bold">100 кредитов</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card-elevated group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-purple rounded-xl flex items-center justify-center mb-4 group-hover:shadow-neon-green transition-shadow">
                <FaVideo className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Анимированные креативы</h3>
              <p className="text-text-secondary">
                GIF и короткие видео для привлечения внимания аудитории
              </p>
              <div className="mt-4 flex items-center text-accent-secondary">
                <span className="font-bold">250 кредитов</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card-elevated group hover:scale-105 transition-transform relative">
              <div className="absolute top-4 right-4">
                <span className="badge badge-purple text-xs">Premium</span>
              </div>
              <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 group-hover:shadow-neon transition-shadow">
                <FaChartLine className="text-3xl text-dark-bg" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI-Скоринг</h3>
              <p className="text-text-secondary">
                Анализ эффективности креатива и рекомендации по улучшению конверсии
              </p>
              <div className="mt-4 flex items-center text-accent-primary">
                <span className="font-bold">20 кредитов</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card-elevated group hover:scale-105 transition-transform relative">
              <div className="absolute top-4 right-4">
                <span className="badge badge-purple text-xs">Premium</span>
              </div>
              <div className="w-16 h-16 bg-gradient-purple rounded-xl flex items-center justify-center mb-4 group-hover:shadow-neon-green transition-shadow">
                <FaVideo className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Видео-морфинг</h3>
              <p className="text-text-secondary">
                Плавные переходы между изображениями для динамичных креативов
              </p>
              <div className="mt-4 flex items-center text-accent-secondary">
                <span className="font-bold">400 кредитов</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="card-elevated group hover:scale-105 transition-transform relative">
              <div className="absolute top-4 right-4">
                <span className="badge badge-purple text-xs">Premium</span>
              </div>
              <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 group-hover:shadow-neon transition-shadow">
                <FaImage className="text-3xl text-dark-bg" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Контекстные креативы</h3>
              <p className="text-text-secondary">
                Генерация на основе анализа вашего сайта или лендинга
              </p>
              <div className="mt-4 flex items-center text-accent-primary">
                <span className="font-bold">150 кредитов</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="card-elevated group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-purple rounded-xl flex items-center justify-center mb-4 group-hover:shadow-neon-green transition-shadow">
                <FaStar className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Библиотека Топ-50</h3>
              <p className="text-text-secondary">
                Изучайте лучшие креативы и получайте вдохновение
              </p>
              <div className="mt-4 flex items-center text-accent-secondary">
                <span className="font-bold">Бесплатный просмотр</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Выберите свой тариф
          </h2>
          <p className="text-text-secondary text-center mb-12 text-lg">
            Начните бесплатно или выберите план для профессионального использования
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <div className="card border-2 border-dark-border">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Free</h3>
                <div className="text-4xl font-bold mt-2">0₽</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  50 тестовых кредитов
                </li>
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  Базовая генерация
                </li>
              </ul>
              <Link href="/register" className="btn btn-secondary w-full text-center">
                Начать бесплатно
              </Link>
            </div>

            {/* Starter */}
            <div className="card border-2 border-accent-primary">
              <div className="mb-4">
                <span className="badge badge-primary text-xs mb-2">Популярный</span>
                <h3 className="text-2xl font-bold">Starter</h3>
                <div className="text-4xl font-bold mt-2">2,990₽</div>
                <p className="text-text-secondary text-sm">в месяц</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  1,500 кредитов/месяц
                </li>
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  Все типы генерации
                </li>
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  AI-скоринг
                </li>
              </ul>
              <Link href="/pricing" className="btn btn-primary w-full text-center">
                Выбрать
              </Link>
            </div>

            {/* Pro */}
            <div className="card border-2 border-accent-purple">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="text-4xl font-bold mt-2">6,990₽</div>
                <p className="text-text-secondary text-sm">в месяц</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  4,000 кредитов/месяц
                </li>
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  API-доступ
                </li>
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  Приоритет поддержка
                </li>
              </ul>
              <Link href="/pricing" className="btn btn-primary w-full text-center">
                Выбрать
              </Link>
            </div>

            {/* Agency */}
            <div className="card border-2 border-accent-secondary">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Agency</h3>
                <div className="text-4xl font-bold mt-2">14,990₽</div>
                <p className="text-text-secondary text-sm">в месяц</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  10,000 кредитов/месяц
                </li>
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  Управление командой
                </li>
                <li className="flex items-center text-text-secondary">
                  <FaCheck className="text-accent-secondary mr-2" />
                  Белый лейбл
                </li>
              </ul>
              <Link href="/pricing" className="btn btn-primary w-full text-center">
                Выбрать
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-dark-surface">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Готовы создавать креативы будущего?
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам таргетологов, которые уже используют AI для создания эффективных креативов
          </p>
          {!user && (
            <Link href="/register" className="btn btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 animate-glow">
              <FaRocket />
              <span>Начать бесплатно</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

