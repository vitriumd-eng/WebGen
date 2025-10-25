'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { generationAPI } from '@/lib/api';
import { Generation, Pricing } from '@/lib/types';
import { FaImage, FaVideo, FaChartLine, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { showSuccess, showError, showPromise } from '@/lib/toast';

export default function GeneratePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('static_image');
  const [prompt, setPrompt] = useState('');
  const [parameters, setParameters] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Generation | null>(null);
  const [error, setError] = useState('');
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    loadPricing();
    loadRecentGenerations();
  }, []);

  const loadPricing = async () => {
    try {
      const response = await generationAPI.getPricing();
      setPricing(response.data);
    } catch (err) {
      console.error('Failed to load pricing', err);
    }
  };

  const loadRecentGenerations = async () => {
    try {
      const response = await generationAPI.getMyGenerations(0, 5);
      setRecentGenerations(response.data);
    } catch (err) {
      console.error('Failed to load recent generations', err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const promise = generationAPI.create({
        type: selectedType,
        prompt: prompt || undefined,
        parameters: Object.keys(parameters).length > 0 ? parameters : undefined
      });

      const response = await showPromise(promise, {
        loading: 'Генерация креатива...',
        success: 'Креатив успешно создан!',
        error: 'Ошибка при генерации'
      });
      
      setResult(response.data);
      await refreshUser();
      await loadRecentGenerations();
      setPrompt('');
      setParameters({});
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Ошибка генерации';
      setError(errorMessage);
      // Toast уже показан через showPromise
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCost = () => {
    const item = pricing.find(p => p.type === selectedType);
    return item?.cost_credits || 0;
  };

  const isPremiumFeature = () => {
    const item = pricing.find(p => p.type === selectedType);
    return item?.requires_subscription || false;
  };

  const generationTypes = [
    {
      id: 'static_image',
      name: 'Статичное изображение',
      icon: FaImage,
      description: 'Высококачественное статичное изображение',
      color: 'accent-primary'
    },
    {
      id: 'animated_image',
      name: 'Анимация',
      icon: FaVideo,
      description: 'GIF или короткое видео',
      color: 'accent-secondary'
    },
    {
      id: 'vector_creative',
      name: 'Векторный креатив',
      icon: FaImage,
      description: 'Масштабируемая векторная графика (SVG) - Recraft.ai',
      color: 'accent-purple',
      premium: false,
      new: true
    },
    {
      id: 'video_morph',
      name: 'Видео-морфинг',
      icon: FaVideo,
      description: 'Плавный переход между изображениями',
      color: 'accent-purple',
      premium: true
    },
    {
      id: 'contextual_photo',
      name: 'Контекстный креатив',
      icon: FaImage,
      description: 'Генерация на основе URL',
      color: 'accent-primary',
      premium: true
    },
    {
      id: 'branded_set',
      name: 'Брендовый Сет',
      icon: FaImage,
      description: '3 креатива в едином брендовом стиле (Fusion)',
      color: 'accent-primary',
      premium: true,
      new: true
    },
    {
      id: 'ai_scoring',
      name: 'AI-Скоринг',
      icon: FaChartLine,
      description: 'Анализ эффективности креатива',
      color: 'accent-secondary',
      premium: true
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-accent-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Генерация контента</h1>
          <p className="text-text-secondary">
            Создайте креатив с помощью AI. Баланс: <span className="text-accent-secondary font-bold">{user.credits_balance}</span> кредитов
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Generation Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Type Selection */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Выберите тип генерации</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generationTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`card-elevated text-left p-4 transition-all ${
                        isSelected ? 'ring-2 ring-accent-primary' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-${type.color}/20 flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`text-2xl text-${type.color}`} />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h3 className="font-bold">{type.name}</h3>
                            {type.premium && (
                              <span className="badge badge-purple text-xs">Premium</span>
                            )}
                            {(type as any).new && (
                              <span className="badge bg-green-500/20 text-green-400 text-xs">NEW</span>
                            )}
                          </div>
                          <p className="text-text-secondary text-sm mt-1">{type.description}</p>
                          <p className="text-accent-primary text-sm font-bold mt-2">
                            {getCurrentCost()} кредитов
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generation Form */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Параметры генерации</h2>
              <form onSubmit={handleGenerate} className="space-y-4">
                {selectedType !== 'ai_scoring' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Промпт (описание желаемого результата)
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="input w-full min-h-[120px]"
                      placeholder="Опишите, что вы хотите создать..."
                      required={selectedType !== 'ai_scoring'}
                    />
                  </div>
                )}

                {selectedType === 'contextual_photo' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">URL сайта</label>
                    <input
                      type="url"
                      value={parameters.url || ''}
                      onChange={(e) => setParameters({...parameters, url: e.target.value})}
                      className="input w-full"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                )}

                {selectedType === 'video_morph' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">URL начального изображения</label>
                      <input
                        type="url"
                        value={parameters.start_image || ''}
                        onChange={(e) => setParameters({...parameters, start_image: e.target.value})}
                        className="input w-full"
                        placeholder="https://example.com/image1.jpg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">URL конечного изображения</label>
                      <input
                        type="url"
                        value={parameters.end_image || ''}
                        onChange={(e) => setParameters({...parameters, end_image: e.target.value})}
                        className="input w-full"
                        placeholder="https://example.com/image2.jpg"
                        required
                      />
                    </div>
                  </>
                )}

                {selectedType === 'ai_scoring' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">URL изображения для анализа</label>
                    <input
                      type="url"
                      value={parameters.image_url || ''}
                      onChange={(e) => setParameters({...parameters, image_url: e.target.value})}
                      className="input w-full"
                      placeholder="https://example.com/creative.jpg"
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="bg-accent-danger/20 border border-accent-danger rounded-lg p-4 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || user.credits_balance < getCurrentCost()}
                  className="btn btn-primary w-full disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <FaSpinner className="animate-spin" />
                      <span>Генерация...</span>
                    </span>
                  ) : (
                    `Сгенерировать (${getCurrentCost()} кредитов)`
                  )}
                </button>

                {user.credits_balance < getCurrentCost() && (
                  <p className="text-accent-danger text-sm text-center">
                    Недостаточно кредитов. <a href="/pricing" className="underline">Пополнить баланс</a>
                  </p>
                )}
              </form>
            </div>

            {/* Result */}
            {result && (
              <div className="card border-2 border-accent-secondary animate-glow">
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <FaCheck className="text-accent-secondary" />
                  <span>Результат</span>
                </h2>
                
                {selectedType === 'ai_scoring' ? (
                  <div>
                    <div className="mb-4">
                      <div className="text-6xl font-bold text-accent-secondary text-center">
                        {result.ai_score}/100
                      </div>
                      <p className="text-center text-text-secondary mt-2">AI Конверсионный Скоринг</p>
                    </div>
                    {result.result_url && (
                      <div className="bg-dark-elevated rounded-lg p-4 text-sm">
                        <p className="text-text-secondary">Рекомендации для улучшения:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Увеличьте контрастность основного элемента</li>
                          <li>Добавьте более яркий CTA-элемент</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {result.result_url && (
                      <div className="bg-dark-elevated rounded-lg p-4 mb-4">
                        <a 
                          href={result.result_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent-primary hover:underline break-all"
                        >
                          {result.result_url}
                        </a>
                      </div>
                    )}
                    <p className="text-text-secondary text-sm">
                      Создано: {new Date(result.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Generations */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Недавние генерации</h3>
              <div className="space-y-3">
                {recentGenerations.length > 0 ? (
                  recentGenerations.map((gen) => (
                    <div key={gen.id} className="bg-dark-elevated rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{gen.type}</span>
                        <span className={`badge ${
                          gen.status === 'completed' ? 'badge-success' : 
                          gen.status === 'failed' ? 'badge-danger' : 'badge-primary'
                        } text-xs`}>
                          {gen.status}
                        </span>
                      </div>
                      <p className="text-text-secondary text-xs">
                        {new Date(gen.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-text-secondary text-sm text-center py-4">
                    У вас пока нет генераций
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-gradient-accent text-dark-bg">
              <h3 className="text-xl font-bold mb-2">Нужно больше кредитов?</h3>
              <p className="text-sm mb-4 opacity-90">
                Пополните баланс или оформите подписку
              </p>
              <a href="/pricing" className="btn bg-white text-dark-bg w-full text-center hover:bg-gray-100">
                Посмотреть тарифы
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

