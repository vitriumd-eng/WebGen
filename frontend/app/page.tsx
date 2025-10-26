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
      {/* HERO SECTION - Блок 1: Ключевой анонс + Флагманский пакет */}
      <section className="relative overflow-hidden py-16 px-4">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Main Announcement */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-accent-primary/20 text-accent-primary px-4 py-2 rounded-full mb-6 animate-pulse-slow">
                <FaBolt className="text-xl" />
                <span className="font-semibold">AI-анализ конкурентов по ссылке</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-accent bg-clip-text text-transparent">Fortar</span> — платформа, которая анализирует группу конкурента и выдает креатив максимально релевантный аудитории
              </h1>
              
              <p className="text-base text-text-secondary mb-6">
                Мгновенное создание нативной рекламы. Вставляешь ссылку — получаешь готовый, адаптированный комплект креативов.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="btn-primary btn-lg flex items-center justify-center space-x-2 group"
                >
                  <span>Начать бесплатно (50 кредитов)</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/pricing" className="btn-secondary btn-lg flex items-center justify-center">
                  Посмотреть тарифы
                </Link>
              </div>
              
              <div className="mt-8 flex items-center space-x-6 text-sm text-text-muted">
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-400" />
                  <span>Без кредитной карты</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-400" />
                  <span>7 AI-движков</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-400" />
                  <span>Топ-50 креативов</span>
                </div>
              </div>
            </div>

            {/* Right: Flagship Package Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-accent rounded-3xl opacity-20 blur-xl animate-pulse-slow"></div>
              <div className="relative card-elevated border-2 border-accent-primary p-8">
                <div className="absolute -top-4 -right-4 bg-accent-primary text-dark-bg px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce-slow">
                  🔥 ФЛАГМАН
                </div>
                
                <div className="mb-6">
                  <h3 className="text-3xl font-bold mb-2">Максимум Тестирования</h3>
                  <p className="text-text-secondary">Комплексный AI-Запуск за один клик</p>
                </div>

                <div className="mb-6 flex items-center justify-center py-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <FaImage className="text-3xl text-accent-primary" />
                      <FaArrowRight className="text-2xl text-accent-secondary" />
                      <FaRocket className="text-3xl text-accent-secondary animate-pulse" />
                    </div>
                    <p className="text-sm text-text-muted">Вставить ссылку → Полный комплект креативов</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0" />
                    <span className="text-sm">5 статичных изображений высокого качества</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0" />
                    <span className="text-sm">2 анимированных креатива (GIF/MP4)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0" />
                    <span className="text-sm">3 AI-скоринга креативов (прогноз CVR)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0" />
                    <span className="text-sm">Анализ целевой аудитории по ссылке</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaCheckCircle className="text-accent-primary mt-1 flex-shrink-0" />
                    <span className="text-sm">Адаптация под брендбук компании</span>
                  </div>
                </div>

                <div className="border-t border-dark-border pt-6 mb-6">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">4 990</span>
                    <span className="text-2xl text-text-secondary">₽</span>
                  </div>
                  <p className="text-center text-sm text-text-muted mt-2">Вместо ~20 000₽ у дизайнера</p>
                </div>

                <button
                  onClick={() => router.push('/pricing')}
                  className="btn-primary w-full btn-lg"
                >
                  Заказать пакет
                </button>

                <p className="text-center text-xs text-text-muted mt-4">
                  Готовность: 15 минут. Гарантия качества.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 2: Проблема и Решение */}
      <section className="py-12 px-4 bg-dark-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Хватит сливать бюджет: <span className="bg-gradient-accent bg-clip-text text-transparent">Узнайте, что сработает, до запуска</span>
            </h2>
            <p className="text-lg text-text-secondary">
              Почему традиционный дизайн и AI без аналитики проигрывают
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Проблема 1 */}
            <div className="card p-8 text-center border-2 border-red-500/20">
              <div className="text-6xl mb-4">😫</div>
              <h3 className="text-xl font-bold mb-3 text-red-400">Дизайнеры без данных</h3>
              <p className="text-text-secondary">
                Создают "красиво", но не знают вашу аудиторию. Результат: креатив не заходит, бюджет слит.
              </p>
              <div className="mt-4 text-red-400 font-bold">20 000₽ и 5 дней впустую</div>
            </div>

            {/* Проблема 2 */}
            <div className="card p-8 text-center border-2 border-yellow-500/20">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-yellow-400">AI без аналитики</h3>
              <p className="text-text-secondary">
                ChatGPT и DALL-E генерируют "по промпту", но не анализируют конкурентов и аудиторию.
              </p>
              <div className="mt-4 text-yellow-400 font-bold">Красиво, но не эффективно</div>
            </div>

            {/* Решение */}
            <div className="card-elevated p-8 text-center border-2 border-accent-primary">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3 text-accent-primary">Наше решение</h3>
              <p className="text-text-secondary">
                AI анализирует конкурентов, их аудиторию и создает креатив, который УЖЕ работает у них.
              </p>
              <div className="mt-4 text-accent-primary font-bold">4 990₽ и 15 минут</div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 3: Как это работает (визуализация процесса) */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Как работает <span className="bg-gradient-accent bg-clip-text text-transparent">AI-анализ по ссылке</span>
            </h2>
            <p className="text-lg text-text-secondary">
              3 простых шага до готового креатива
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Шаг 1 */}
            <div className="relative">
              <div className="card p-8 text-center h-full">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Вставьте ссылку</h3>
                <p className="text-text-secondary mb-4">
                  URL группы конкурента, сообщества или страницы продукта
                </p>
                <div className="bg-dark-surface rounded-lg p-4 text-sm text-accent-primary font-mono">
                  vk.com/competitor_group
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-full">
                <FaArrowRight className="text-3xl text-accent-secondary" />
              </div>
            </div>

            {/* Шаг 2 */}
            <div className="relative">
              <div className="card p-8 text-center h-full">
                <div className="w-16 h-16 bg-gradient-purple rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">AI анализирует</h3>
                <p className="text-text-secondary mb-4">
                  Извлекаем данные об аудитории, интересах, активности и контенте
                </p>
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-3 h-3 bg-accent-primary rounded-full animate-ping"></div>
                  <div className="w-3 h-3 bg-accent-secondary rounded-full animate-ping animation-delay-200"></div>
                  <div className="w-3 h-3 bg-accent-primary rounded-full animate-ping animation-delay-400"></div>
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-full">
                <FaArrowRight className="text-3xl text-accent-secondary" />
              </div>
            </div>

            {/* Шаг 3 */}
            <div className="card-elevated p-8 text-center h-full">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold animate-pulse">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Получите комплект</h3>
              <p className="text-text-secondary mb-4">
                Готовые креативы, адаптированные под аудиторию конкурента
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-12 h-12 bg-accent-primary/20 rounded-lg"></div>
                <div className="w-12 h-12 bg-accent-secondary/20 rounded-lg"></div>
                <div className="w-12 h-12 bg-accent-primary/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 4: AI-Скоринг CVR/ROAS */}
      <section className="py-12 px-4 bg-dark-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-accent-secondary/20 text-accent-secondary px-4 py-2 rounded-full mb-6">
                <FaShieldAlt />
                <span className="font-semibold">Функция снижения риска</span>
              </div>
              
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-accent bg-clip-text text-transparent">AI-Скоринг CVR/ROAS</span>: Как за 100₽ узнать, сработает ли креатив
              </h2>
              
              <p className="text-xl text-text-secondary mb-8">
                Зачем тратить 10 000₽ на тестирование, если можно получить прогноз конверсии за 100₽?
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaChartLine className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Прогноз конверсии</h4>
                    <p className="text-text-secondary">
                      AI анализирует креатив и выдает балл 70-95/100 с объяснением
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Рекомендации по улучшению</h4>
                    <p className="text-text-secondary">
                      2-3 конкретных совета, как поднять CTR и CVR
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaBolt className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Мгновенный результат</h4>
                    <p className="text-text-secondary">
                      Анализ занимает 10 секунд вместо недель тестирования
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-dark-bg rounded-xl border border-accent-primary/30">
                <div className="flex items-center justify-center">
                  <span className="text-text-secondary mr-4">Стоимость AI-скоринга:</span>
                  <span className="text-3xl font-bold text-accent-primary">100₽</span>
                </div>
              </div>
            </div>

            {/* Visualization: Scoring Graph */}
            <div className="relative">
              <div className="card-elevated p-8">
                <h4 className="text-center font-bold mb-6">Пример AI-скоринга</h4>
                
                {/* Score Meter */}
                <div className="mb-8">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-text-secondary">CVR Score</span>
                    <span className="text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">87/100</span>
                  </div>
                  <div className="h-4 bg-dark-bg rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-accent" style={{width: '87%'}}></div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <div className="p-4 bg-dark-bg rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaCheckCircle className="text-green-400" />
                      <span className="font-semibold text-sm">Сильные стороны</span>
                    </div>
                    <p className="text-xs text-text-secondary">Яркий контраст, четкий CTA, эмоциональная фотография</p>
                  </div>

                  <div className="p-4 bg-dark-bg rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaArrowRight className="text-yellow-400" />
                      <span className="font-semibold text-sm">Рекомендации</span>
                    </div>
                    <p className="text-xs text-text-secondary">Добавить социальное доказательство, усилить оффер</p>
                  </div>

                  <div className="p-4 bg-dark-bg rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaChartLine className="text-accent-primary" />
                      <span className="font-semibold text-sm">Прогноз</span>
                    </div>
                    <p className="text-xs text-text-secondary">CTR: 2.1-2.5% | CVR: 3.8-4.2% | ROAS: 4.2x</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 5: Премиум-Форматы (AI Fusion) */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Доступ к <span className="bg-gradient-accent bg-clip-text text-transparent">премиум-форматам</span>, которые поднимают CTR
            </h2>
            <p className="text-lg text-text-secondary">
              Векторные креативы, морфинг-видео и AI Fusion — всё в одной платформе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Векторный креатив */}
            <div className="card-elevated p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Векторный креатив</h3>
                <span className="badge bg-accent-primary text-dark-bg">NEW</span>
              </div>
              
              <div className="aspect-video bg-gradient-accent rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <FaImage className="text-6xl relative z-10" />
              </div>

              <p className="text-text-secondary mb-4">
                Масштабируемая векторная графика (SVG) для логотипов и иконок через Recraft.ai
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                <span className="text-text-secondary">Стоимость:</span>
                <span className="text-2xl font-bold text-accent-primary">120₽</span>
              </div>
            </div>

            {/* Видео-морфинг */}
            <div className="card-elevated p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Морфинг-видео</h3>
                <span className="badge badge-purple">Premium</span>
              </div>
              
              <div className="aspect-video bg-gradient-purple rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <FaVideo className="text-6xl relative z-10" />
              </div>

              <p className="text-text-secondary mb-4">
                Плавный переход между изображениями — идеально для stories и reels
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                <span className="text-text-secondary">Стоимость:</span>
                <span className="text-2xl font-bold text-accent-secondary">400₽</span>
              </div>
            </div>

            {/* Брендовый сет */}
            <div className="card-elevated p-8 md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Брендовый Сет (AI Fusion)</h3>
                <span className="badge bg-gradient-accent text-dark-bg">🔥 HOT</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="aspect-square bg-gradient-accent rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <div className="aspect-square bg-gradient-purple rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <div className="aspect-square bg-gradient-accent rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold">3</span>
                </div>
              </div>

              <p className="text-text-secondary mb-4 text-center">
                Fusion-цепочка: Recraft.ai + Брендбук. Генерация 3-х креативов в едином стиле
              </p>

              <div className="flex items-center justify-center pt-4 border-t border-dark-border">
                <span className="text-text-secondary mr-4">Стоимость:</span>
                <span className="text-3xl font-bold text-accent-primary">200₽</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 6: ROI-Сравнение */}
      <section className="py-12 px-4 bg-dark-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Сравните <span className="bg-gradient-accent bg-clip-text text-transparent">стоимость</span> с альтернативами
            </h2>
            <p className="text-lg text-text-secondary">
              Агентство vs. Дизайнер vs. Наш флагманский пакет
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-dark-border">
                  <th className="text-left py-4 px-4">Параметр</th>
                  <th className="text-center py-4 px-4">Агентство</th>
                  <th className="text-center py-4 px-4">Дизайнер</th>
                  <th className="text-center py-4 px-4 bg-accent-primary/10 rounded-t-xl">
                    <span className="bg-gradient-accent bg-clip-text text-transparent font-bold">Наш пакет</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dark-border">
                  <td className="py-4 px-4">Стоимость</td>
                  <td className="text-center py-4 px-4 text-red-400">50 000₽</td>
                  <td className="text-center py-4 px-4 text-yellow-400">20 000₽</td>
                  <td className="text-center py-4 px-4 bg-accent-primary/10 text-accent-primary font-bold">4 990₽</td>
                </tr>
                <tr className="border-b border-dark-border">
                  <td className="py-4 px-4">Срок выполнения</td>
                  <td className="text-center py-4 px-4">7-14 дней</td>
                  <td className="text-center py-4 px-4">3-5 дней</td>
                  <td className="text-center py-4 px-4 bg-accent-primary/10 text-accent-primary font-bold">15 минут</td>
                </tr>
                <tr className="border-b border-dark-border">
                  <td className="py-4 px-4">Анализ конкурентов</td>
                  <td className="text-center py-4 px-4">✅ Да</td>
                  <td className="text-center py-4 px-4">❌ Нет</td>
                  <td className="text-center py-4 px-4 bg-accent-primary/10 text-accent-primary">✅ AI-анализ</td>
                </tr>
                <tr className="border-b border-dark-border">
                  <td className="py-4 px-4">AI-скоринг CVR</td>
                  <td className="text-center py-4 px-4">❌ Нет</td>
                  <td className="text-center py-4 px-4">❌ Нет</td>
                  <td className="text-center py-4 px-4 bg-accent-primary/10 text-accent-primary">✅ Включено</td>
                </tr>
                <tr className="border-b border-dark-border">
                  <td className="py-4 px-4">Количество креативов</td>
                  <td className="text-center py-4 px-4">3-5 шт</td>
                  <td className="text-center py-4 px-4">3-5 шт</td>
                  <td className="text-center py-4 px-4 bg-accent-primary/10 text-accent-primary font-bold">10 шт</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Правки</td>
                  <td className="text-center py-4 px-4">2-3 раунда</td>
                  <td className="text-center py-4 px-4">1-2 раунда</td>
                  <td className="text-center py-4 px-4 bg-accent-primary/10 text-accent-primary rounded-b-xl">Неограниченно</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-bold mb-4">
              Экономия: <span className="text-green-400">до 45 000₽</span> по сравнению с агентством
            </p>
            <button onClick={() => router.push('/pricing')} className="btn-primary btn-lg">
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
      <section className="py-12 px-4 bg-dark-surface">
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
              <div className="mt-6 pt-6 border-t border-dark-border text-center">
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
                <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                  <span className="text-sm">Статичное изображение</span>
                  <span className="font-bold text-accent-primary">100₽</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                  <span className="text-sm">Векторный креатив</span>
                  <span className="font-bold text-accent-primary">120₽</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                  <span className="text-sm">Анимация (GIF/MP4)</span>
                  <span className="font-bold text-accent-primary">250₽</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                  <span className="text-sm">AI-скоринг</span>
                  <span className="font-bold text-accent-primary">20₽</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-dark-border text-center">
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
                  <div className="absolute inset-0 bg-dark-bg opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center">
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
      <section className="py-16 px-4 bg-gradient-to-br from-accent-primary/20 via-dark-surface to-accent-secondary/20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-accent-primary text-dark-bg px-6 py-3 rounded-full mb-8 text-lg font-bold animate-bounce-slow">
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
