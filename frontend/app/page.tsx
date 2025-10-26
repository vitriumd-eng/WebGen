'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowRight, FaChartLine, FaRocket, FaVideo, FaImage, FaStar, FaCheckCircle, FaBolt, FaShieldAlt, FaFire } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      router.push('/generate');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Блок 1: Ключевой анонс с Glassmorphism */}
      <section className="relative overflow-hidden min-h-screen flex items-center px-4 mt-16">
        {/* Animated background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50"></div>
        
        {/* Large background shapes */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content with Glass Card */}
            <div>
              <div className="glass-strong rounded-3xl p-10 mb-8">
                <div className="inline-flex items-center space-x-2 glass-button px-6 py-3 rounded-full mb-6">
                  <FaBolt className="text-accent-primary" />
                  <span className="font-semibold text-accent-primary">AI-анализ конкурентов</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-text-primary">
                  <span className="bg-gradient-accent bg-clip-text text-transparent">Fortar</span>
                </h1>
                
                <p className="text-2xl font-semibold text-text-primary mb-4">
                  Анализируй. Создавай. Запускай.
                </p>
                
                <p className="text-lg text-text-secondary mb-8">
                  Платформа, которая анализирует группу конкурента и выдает креатив максимально релевантный аудитории
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={handleGetStarted}
                    className="bg-gradient-accent text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 group hover:shadow-glass-lg transition-all"
                  >
                    <span>Начать бесплатно</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <Link href="/generate" className="glass-button px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2">
                    <FaRocket />
                    <span>Генерация</span>
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="glass-button px-4 py-2 rounded-full flex items-center space-x-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>50 кредитов бесплатно</span>
                  </div>
                  <div className="glass-button px-4 py-2 rounded-full flex items-center space-x-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>7 AI-движков</span>
                  </div>
                  <div className="glass-button px-4 py-2 rounded-full flex items-center space-x-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>Топ-50 креативов</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Large Product Image with Glass Effect */}
            <div className="relative">
              <div className="glass-card p-8 transform hover:scale-105 transition-all duration-500">
                <div className="aspect-square bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-3xl flex items-center justify-center overflow-hidden relative">
                  {/* Product showcase placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm"></div>
                  <div className="relative z-10 text-center p-8">
                    <FaImage className="text-8xl text-white/60 mb-4 mx-auto" />
                    <p className="text-2xl font-bold text-white drop-shadow-lg">AI Креатив</p>
                    <p className="text-white/80 mt-2">Анализ + Генерация</p>
                  </div>
                </div>
                
                {/* Glass stats overlay */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="glass-button p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-accent-primary">100₽</div>
                    <div className="text-xs text-text-muted">AI-Scoring</div>
                  </div>
                  <div className="glass-button p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-accent-secondary">15 мин</div>
                    <div className="text-xs text-text-muted">Готовность</div>
                  </div>
                  <div className="glass-button p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-accent-purple">Top-50</div>
                    <div className="text-xs text-text-muted">Библиотека</div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-8 -right-8 glass-button p-6 rounded-2xl animate-bounce-slow">
                <FaRocket className="text-3xl text-accent-primary" />
              </div>
              <div className="absolute -bottom-8 -left-8 glass-button p-6 rounded-2xl animate-pulse-slow">
                <FaStar className="text-3xl text-accent-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 2: Проблема и Решение с Glass Cards */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Хватит <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">сливать бюджет</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Узнайте, что сработает, ДО запуска рекламной кампании
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Проблема 1 */}
            <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-400 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto">
                😫
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-primary">Дизайнеры без данных</h3>
              <p className="text-text-secondary mb-6">
                Создают "красиво", но не знают вашу аудиторию. Результат: креатив не заходит, бюджет слит.
              </p>
              <div className="glass-button px-4 py-2 rounded-full inline-block">
                <span className="text-red-500 font-bold">20 000₽ впустую</span>
              </div>
            </div>

            {/* Проблема 2 */}
            <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto">
                🤖
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-primary">AI без аналитики</h3>
              <p className="text-text-secondary mb-6">
                ChatGPT и DALL-E генерируют "по промпту", но не анализируют конкурентов и аудиторию.
              </p>
              <div className="glass-button px-4 py-2 rounded-full inline-block">
                <span className="text-yellow-600 font-bold">Красиво, но не работает</span>
              </div>
            </div>

            {/* Решение */}
            <div className="glass-strong p-8 text-center hover:scale-105 transition-all duration-300 border-2 border-accent-primary/30">
              <div className="w-20 h-20 bg-gradient-accent rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto">
                🚀
              </div>
              <h3 className="text-2xl font-bold mb-4 text-accent-primary">Наше решение</h3>
              <p className="text-text-secondary mb-6">
                AI анализирует конкурентов, их аудиторию и создает креатив, который УЖЕ работает у них.
              </p>
              <div className="bg-gradient-accent px-6 py-3 rounded-full inline-block">
                <span className="text-white font-bold">4 990₽ за 15 минут</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Флагманский пакет: Максимум Тестирования с Glassmorphism */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        
        {/* Animated shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="glass-strong rounded-3xl p-12 relative overflow-hidden">
            {/* Floating badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-accent px-8 py-3 rounded-full font-bold text-lg shadow-glass-lg z-20">
              <span className="text-white">🔥 ФЛАГМАН</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8">
              {/* Left: Package details */}
              <div>
                <h2 className="text-5xl font-bold mb-4 text-text-primary">
                  Максимум Тестирования
                </h2>
                <p className="text-2xl text-text-secondary mb-8">
                  Комплексный AI-Запуск за один клик
                </p>

                <div className="flex items-center space-x-4 mb-8 glass-button p-6 rounded-2xl">
                  <FaImage className="text-5xl text-accent-primary" />
                  <FaArrowRight className="text-3xl text-accent-secondary" />
                  <FaRocket className="text-5xl text-accent-secondary animate-pulse" />
                </div>

                    <div className="glass-button p-4 rounded-xl flex items-start space-x-3">
                      <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0 text-2xl" />
                      <span className="text-base">5 статичных изображений</span>
                    </div>
                    <div className="glass-button p-4 rounded-xl flex items-start space-x-3">
                      <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0 text-2xl" />
                      <span className="text-base">2 анимации (GIF/MP4)</span>
                    </div>
                    <div className="glass-button p-4 rounded-xl flex items-start space-x-3">
                      <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0 text-2xl" />
                      <span className="text-base">3 AI-скоринга (CVR)</span>
                    </div>
                    <div className="glass-button p-4 rounded-xl flex items-start space-x-3">
                      <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0 text-2xl" />
                      <span className="text-base">Анализ аудитории</span>
                    </div>
                    <div className="glass-button p-4 rounded-xl flex items-start space-x-3">
                      <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0 text-2xl" />
                      <span className="text-base">Адаптация брендбука</span>
                    </div>
                    <div className="glass-button p-4 rounded-xl flex items-start space-x-3">
                      <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0 text-2xl" />
                      <span className="text-base">Готовность: 15 минут</span>
                    </div>
                  </div>
                </div>

                <div className="glass-button p-8 rounded-2xl text-center">
                  <div className="flex items-baseline justify-center space-x-3 mb-3">
                    <span className="text-6xl font-bold bg-gradient-accent bg-clip-text text-transparent">4 990</span>
                    <span className="text-3xl text-text-secondary">₽</span>
                  </div>
                  <p className="text-text-muted mb-6">Вместо ~20 000₽ у дизайнера</p>
                  
                  <button
                    onClick={() => router.push('/pricing')}
                    className="bg-gradient-accent text-white px-12 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition-all duration-300 shadow-glass-lg w-full"
                  >
                    Заказать пакет
                  </button>
                </div>
              </div>

              {/* Right: Visual showcase */}
              <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-500">
                <div className="aspect-square bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-3xl mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-7xl mb-4">📊</div>
                      <p className="text-2xl font-bold text-white">AI-Анализ</p>
                      <p className="text-lg text-white/80">Полный комплект</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-button p-3 rounded-xl text-center">
                    <div className="text-3xl mb-1">🎨</div>
                    <p className="text-xs text-text-muted">Дизайн</p>
                  </div>
                  <div className="glass-button p-3 rounded-xl text-center">
                    <div className="text-3xl mb-1">📹</div>
                    <p className="text-xs text-text-muted">Видео</p>
                  </div>
                  <div className="glass-button p-3 rounded-xl text-center">
                    <div className="text-3xl mb-1">⚡</div>
                    <p className="text-xs text-text-muted">Быстро</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 3: Как это работает с Glassmorphism Timeline */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Как работает <span className="bg-gradient-accent bg-clip-text text-transparent">AI-анализ</span>
            </h2>
            <p className="text-xl text-text-secondary">
              3 простых шага до готового креатива
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Шаг 1 */}
              <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
                <div className="w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-glass-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary">Вставьте ссылку</h3>
                <p className="text-text-secondary mb-6">
                  URL группы конкурента, сообщества или страницы продукта
                </p>
                <div className="glass-button p-4 rounded-xl text-accent-primary font-mono text-sm">
                  vk.com/competitor_group
                </div>
                
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-full">
                  <div className="glass-button p-3 rounded-full">
                    <FaArrowRight className="text-3xl text-accent-secondary" />
                  </div>
                </div>
              </div>

              {/* Шаг 2 */}
              <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-glass-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary">AI анализирует</h3>
                <p className="text-text-secondary mb-6">
                  Извлекаем данные об аудитории, интересах, активности и контенте
                </p>
                <div className="flex justify-center items-center space-x-3 mt-6">
                  <div className="w-4 h-4 bg-accent-primary rounded-full animate-ping"></div>
                  <div className="w-4 h-4 bg-accent-secondary rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-4 h-4 bg-accent-primary rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                </div>
                
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-full">
                  <div className="glass-button p-3 rounded-full">
                    <FaArrowRight className="text-3xl text-accent-secondary" />
                  </div>
                </div>
              </div>

              {/* Шаг 3 */}
              <div className="glass-strong p-8 text-center hover:scale-105 transition-all duration-300 border-2 border-accent-secondary/30">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-glass-lg animate-pulse">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4 text-accent-secondary">Получите комплект</h3>
                <p className="text-text-secondary mb-6">
                  Готовые креативы, адаптированные под аудиторию конкурента
                </p>
                <div className="flex justify-center space-x-3 mt-6">
                  <div className="w-16 h-16 glass-button rounded-2xl flex items-center justify-center text-2xl">🎨</div>
                  <div className="w-16 h-16 glass-button rounded-2xl flex items-center justify-center text-2xl">📹</div>
                  <div className="w-16 h-16 glass-button rounded-2xl flex items-center justify-center text-2xl">✨</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 4: AI-Скоринг CVR/ROAS с Interactive Glass Card */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50"></div>
        
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="glass-button inline-flex items-center space-x-2 px-6 py-3 rounded-full mb-6">
                <FaShieldAlt className="text-accent-secondary" />
                <span className="font-semibold text-accent-secondary">Снижение риска</span>
              </div>
              
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-accent bg-clip-text text-transparent">AI-Скоринг</span> CVR/ROAS
              </h2>
              
              <p className="text-2xl text-text-secondary mb-10">
                Узнайте, сработает ли креатив <span className="text-accent-primary font-bold">за 100₽</span> вместо 10 000₽ на тесты
              </p>

              <div className="space-y-6 mb-10">
                <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center flex-shrink-0 text-white">
                      <FaChartLine className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Прогноз конверсии</h4>
                      <p className="text-text-secondary">
                        AI анализирует креатив и выдает балл 70-95/100 с объяснением
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 text-white">
                      <FaCheckCircle className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Рекомендации</h4>
                      <p className="text-text-secondary">
                        2-3 конкретных совета, как поднять CTR и CVR
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 text-white">
                      <FaBolt className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">За 10 секунд</h4>
                      <p className="text-text-secondary">
                        Вместо недель тестирования
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-strong p-8 rounded-2xl text-center">
                <p className="text-text-secondary mb-3">Стоимость AI-скоринга:</p>
                <span className="text-6xl font-bold bg-gradient-accent bg-clip-text text-transparent">100₽</span>
              </div>
            </div>

            {/* Visualization: Interactive Scoring Dashboard */}
            <div className="glass-strong p-10 rounded-3xl">
              <h4 className="text-center font-bold text-2xl mb-8">Пример AI-скоринга</h4>
              
              {/* Score Meter */}
              <div className="mb-10">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-lg text-text-secondary">CVR Score</span>
                  <span className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">87/100</span>
                </div>
                <div className="h-6 glass-button rounded-full overflow-hidden relative">
                  <div className="h-full bg-gradient-accent rounded-full animate-pulse" style={{width: '87%'}}></div>
                </div>
              </div>

              {/* Recommendations Cards */}
              <div className="space-y-4">
                <div className="glass-button p-5 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <span className="font-bold">Сильные стороны</span>
                  </div>
                  <p className="text-sm text-text-secondary pl-8">Яркий контраст, четкий CTA, эмоциональная фотография</p>
                </div>

                <div className="glass-button p-5 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaArrowRight className="text-yellow-500 text-xl" />
                    <span className="font-bold">Рекомендации</span>
                  </div>
                  <p className="text-sm text-text-secondary pl-8">Добавить социальное доказательство, усилить оффер</p>
                </div>

                <div className="glass-button p-5 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaChartLine className="text-accent-primary text-xl" />
                    <span className="font-bold">Прогноз</span>
                  </div>
                  <p className="text-sm text-text-secondary pl-8">CTR: 2.1-2.5% | CVR: 3.8-4.2% | ROAS: 4.2x</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 5: Премиум-Форматы с Glass Gallery */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Премиум-форматы <span className="bg-gradient-accent bg-clip-text text-transparent">для CTR</span>
            </h2>
            <p className="text-xl text-text-secondary">
              Векторные креативы, морфинг-видео и AI Fusion в одной платформе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Векторный креатив */}
            <div className="glass-strong p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Векторный креатив</h3>
                <span className="glass-button px-4 py-2 rounded-full text-sm font-bold text-accent-primary">NEW</span>
              </div>
              
              <div className="aspect-video bg-gradient-accent rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/20"></div>
                <FaImage className="text-7xl text-white relative z-10" />
              </div>

              <p className="text-text-secondary mb-6 text-lg">
                Масштабируемая векторная графика (SVG) для логотипов и иконок через Recraft.ai
              </p>

              <div className="glass-button p-4 rounded-xl flex items-center justify-between">
                <span className="text-text-secondary">Стоимость:</span>
                <span className="text-3xl font-bold text-accent-primary">120₽</span>
              </div>
            </div>

            {/* Видео-морфинг */}
            <div className="glass-strong p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Морфинг-видео</h3>
                <span className="glass-button px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">Premium</span>
              </div>
              
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/20"></div>
                <FaVideo className="text-7xl text-white relative z-10" />
              </div>

              <p className="text-text-secondary mb-6 text-lg">
                Плавный переход между изображениями — идеально для stories и reels
              </p>

              <div className="glass-button p-4 rounded-xl flex items-center justify-between">
                <span className="text-text-secondary">Стоимость:</span>
                <span className="text-3xl font-bold text-accent-secondary">400₽</span>
              </div>
            </div>

            {/* Брендовый сет */}
            <div className="glass-strong p-10 rounded-3xl md:col-span-2 hover:scale-105 transition-all duration-300 border-2 border-accent-primary/30">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold">Брендовый Сет (AI Fusion)</h3>
                <span className="bg-gradient-accent px-6 py-3 rounded-full text-lg font-bold text-white shadow-glass-lg">🔥 HOT</span>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="aspect-square bg-gradient-accent rounded-3xl flex items-center justify-center shadow-glass-lg hover:scale-110 transition-all duration-300">
                  <span className="text-4xl font-bold text-white">1</span>
                </div>
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-glass-lg hover:scale-110 transition-all duration-300">
                  <span className="text-4xl font-bold text-white">2</span>
                </div>
                <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-glass-lg hover:scale-110 transition-all duration-300">
                  <span className="text-4xl font-bold text-white">3</span>
                </div>
              </div>

              <p className="text-text-secondary mb-8 text-center text-xl">
                Fusion-цепочка: Recraft.ai + Брендбук. Генерация 3-х креативов в едином стиле
              </p>

              <div className="glass-button p-6 rounded-2xl flex items-center justify-center">
                <span className="text-text-secondary mr-4 text-lg">Стоимость:</span>
                <span className="text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">200₽</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 6: ROI-Сравнение с Glass Cards */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Сравните <span className="bg-gradient-accent bg-clip-text text-transparent">стоимость</span>
            </h2>
            <p className="text-xl text-text-secondary">
              Агентство vs. Дизайнер vs. Fortar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Агентство */}
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Агентство</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-text-secondary mb-2">Стоимость</p>
                  <p className="text-4xl font-bold text-red-500">50 000₽</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">Срок</p>
                  <p className="font-bold">7-14 дней</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">Анализ</p>
                  <p className="font-bold">✅ Да</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">AI-скоринг</p>
                  <p className="font-bold">❌ Нет</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">Креативов</p>
                  <p className="font-bold">3-5 шт</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">Правки</p>
                  <p className="font-bold">2-3 раунда</p>
                </div>
              </div>
            </div>

            {/* Дизайнер */}
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Дизайнер</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-text-secondary mb-2">Стоимость</p>
                  <p className="text-4xl font-bold text-yellow-600">20 000₽</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">Срок</p>
                  <p className="font-bold">3-5 дней</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">Анализ</p>
                  <p className="font-bold">❌ Нет</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">AI-скоринг</p>
                  <p className="font-bold">❌ Нет</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">Креативов</p>
                  <p className="font-bold">3-5 шт</p>
                </div>
                <div className="glass-button p-4 rounded-xl">
                  <p className="text-sm text-text-secondary mb-1">Правки</p>
                  <p className="font-bold">1-2 раунда</p>
                </div>
              </div>
            </div>

            {/* Наш пакет */}
            <div className="glass-strong p-8 rounded-3xl border-2 border-accent-primary shadow-glass-lg scale-105">
              <div className="bg-gradient-accent px-4 py-2 rounded-full text-white font-bold text-center mb-6">
                🏆 FORTAR
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-text-secondary mb-2">Стоимость</p>
                  <p className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">4 990₽</p>
                </div>
                <div className="glass-button p-4 rounded-xl border border-accent-primary/30">
                  <p className="text-sm text-text-secondary mb-1">Срок</p>
                  <p className="font-bold text-accent-primary">15 минут</p>
                </div>
                <div className="glass-button p-4 rounded-xl border border-accent-primary/30">
                  <p className="text-sm text-text-secondary mb-1">Анализ</p>
                  <p className="font-bold text-accent-primary">✅ AI-анализ</p>
                </div>
                <div className="glass-button p-4 rounded-xl border border-accent-primary/30">
                  <p className="text-sm text-text-secondary mb-1">AI-скоринг</p>
                  <p className="font-bold text-accent-primary">✅ Включено</p>
                </div>
                <div className="glass-button p-4 rounded-xl border border-accent-primary/30">
                  <p className="text-sm text-text-secondary mb-1">Креативов</p>
                  <p className="font-bold text-accent-primary">10 шт</p>
                </div>
                <div className="glass-button p-4 rounded-xl border border-accent-primary/30">
                  <p className="text-sm text-text-secondary mb-1">Правки</p>
                  <p className="font-bold text-accent-primary">Неограниченно</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-strong p-10 rounded-3xl text-center max-w-2xl mx-auto">
            <p className="text-3xl font-bold mb-6">
              Экономия: <span className="text-green-500">до 45 000₽</span>
            </p>
            <button onClick={() => router.push('/pricing')} className="bg-gradient-accent text-white px-12 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition-all duration-300 shadow-glass-lg">
              Получить доступ сейчас
            </button>
          </div>
        </div>
      </section>

      {/* Блок 7: AI Hub */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-accent bg-clip-text text-transparent">AI Hub</span>: 7 движков в одном окне
            </h2>
            <p className="text-lg text-text-secondary">
              Платите только за то, что используете. Выбирайте лучший AI для каждой задачи.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'DALL-E 3', specialty: 'Фотореализм' },
              { name: 'Stable Diffusion', specialty: 'Стилизация' },
              { name: 'Recraft.ai', specialty: 'Векторы' },
              { name: 'RunwayML', specialty: 'Анимация' },
              { name: 'Pika Labs', specialty: 'Видео' },
              { name: 'GPT-4 Vision', specialty: 'Контекст' },
              { name: 'Midjourney', specialty: 'Арт' },
              { name: 'GPT-4', specialty: 'Скоринг' }
            ].map((engine, idx) => (
              <div key={idx} className="card p-6 text-center hover:border-accent-primary transition-all">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaStar />
                </div>
                <h4 className="font-bold mb-1 text-sm">{engine.name}</h4>
                <p className="text-xs text-text-muted">{engine.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 8: Модель Оплаты */}
      <section className="py-12 px-4 bg-light-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Гибридная система: <span className="bg-gradient-accent bg-clip-text text-transparent">Подписка + Кредиты</span>
            </h2>
            <p className="text-lg text-text-secondary">
              Платите за доступ к интеллекту, а за креативы — только когда используете
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Подписка */}
            <div className="card-elevated p-8">
              <div className="text-5xl mb-6 text-center">🔑</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Подписка</h3>
              <p className="text-text-secondary text-center mb-6">
                Доступ к премиум-функциям и AI-анализу
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-accent-primary flex-shrink-0" />
                  <span className="text-sm">Видео-морфинг и контекстные креативы</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-accent-primary flex-shrink-0" />
                  <span className="text-sm">AI-скоринг CVR/ROAS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-accent-primary flex-shrink-0" />
                  <span className="text-sm">Анализ конкурентов по ссылке</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-accent-primary flex-shrink-0" />
                  <span className="text-sm">Скидки на пакеты креативов</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-light-border text-center">
                <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                  от 2 990₽
                </div>
                <div className="text-sm text-text-muted">в месяц</div>
              </div>
            </div>

            {/* Кредиты */}
            <div className="card-elevated p-8">
              <div className="text-5xl mb-6 text-center">💳</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Кредиты</h3>
              <p className="text-text-secondary text-center mb-6">
                Платите только за то, что генерируете
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-light-bg rounded-lg">
                  <span className="text-sm">Статичное изображение</span>
                  <span className="font-bold text-accent-primary">100₽</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-light-bg rounded-lg">
                  <span className="text-sm">Векторный креатив</span>
                  <span className="font-bold text-accent-primary">120₽</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-light-bg rounded-lg">
                  <span className="text-sm">Анимация (GIF/MP4)</span>
                  <span className="font-bold text-accent-primary">250₽</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-light-bg rounded-lg">
                  <span className="text-sm">AI-скоринг</span>
                  <span className="font-bold text-accent-primary">20₽</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-light-border text-center">
                <div className="text-sm text-accent-primary font-semibold">
                  1 Кредит = 1 Рубль
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl mb-6">
              💡 <span className="font-bold">Совет:</span> Начните с бесплатного тарифа (50 кредитов), попробуйте платформу, затем выберите подписку
            </p>
            <button onClick={handleGetStarted} className="btn-primary btn-lg">
              Получить 50 бесплатных кредитов
            </button>
          </div>
        </div>
      </section>

      {/* Блок 9: Библиотека Топ-50 */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-accent bg-clip-text text-transparent">Библиотека Топ-50 креативов</span>
            </h2>
            <p className="text-lg text-text-secondary">
              Изучайте лучшие гипотезы конкурентов до того, как они их поменяли
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[...Array(10)].map((_, idx) => (
              <div key={idx} className="aspect-square card p-4 hover:border-accent-primary transition-all cursor-pointer group">
                <div className="w-full h-full bg-gradient-accent rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-light-bg opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center">
                    <FaStar className="text-2xl text-accent-primary" />
                  </div>
                  <span className="text-3xl font-bold">#{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto card-elevated p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">👀</div>
                <h4 className="font-bold mb-2">Просмотр Топ-50</h4>
                <p className="text-text-secondary text-sm mb-4">
                  Бесплатный доступ к превью всех креативов
                </p>
                <div className="text-2xl font-bold text-green-400">БЕСПЛАТНО</div>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🔓</div>
                <h4 className="font-bold mb-2">Детали и промпт</h4>
                <p className="text-text-secondary text-sm mb-4">
                  Полный креатив + промпт для воспроизведения
                </p>
                <div className="text-2xl font-bold text-accent-primary">5₽</div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/library" className="btn-secondary btn-lg">
              Перейти в библиотеку
            </Link>
          </div>
        </div>
      </section>

      {/* Блок 10: Финальный CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-primary/20 via-light-surface to-accent-secondary/20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-accent-primary text-light-bg px-6 py-3 rounded-full mb-8 text-lg font-bold animate-bounce-slow">
              <FaFire />
              <span>Специальное предложение</span>
            </div>

            <h2 className="text-5xl font-bold mb-6">
              Готовы запустить <span className="bg-gradient-accent bg-clip-text text-transparent">эффективную рекламу?</span>
            </h2>
            
            <p className="text-2xl text-text-secondary mb-12">
              Начните бесплатно с 50 кредитами или сразу получите доступ ко всем премиум-функциям
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button
                onClick={handleGetStarted}
                className="btn-primary btn-lg text-xl px-12 py-6 shadow-2xl hover:shadow-accent-primary/50 transition-all"
              >
                <span>Начать бесплатно</span>
                <span className="block text-sm opacity-80">50 кредитов в подарок</span>
              </button>
              
              <button
                onClick={() => router.push('/pricing')}
                className="btn-secondary btn-lg text-xl px-12 py-6"
              >
                <span>Подписаться на Starter</span>
                <span className="block text-sm opacity-80">2 990₽/мес + 1 500 кредитов</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-text-muted">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-accent-primary" />
                <span>Без кредитной карты</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-accent-primary" />
                <span>Отмена в любой момент</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-accent-primary" />
                <span>Гарантия качества</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
