'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/lib/toast';

interface MarginCalculation {
  generation_type: string;
  base_cost_usd: number;
  exchange_rate: number;
  cost_rub: number;
  markup_percentage: number;
  final_price_rub: number;
  profit_rub: number;
  profit_percentage: number;
}

interface PricingConfig {
  id: number;
  key: string;
  value: number;
  description: string;
  updated_at: string;
}

interface AiEngine {
  id: number;
  name: string;
  description: string;
  role: string;
  internal_cost_usd_per_unit: number;
  markup_percentage: number;
  is_active: boolean;
  generation_type: string | null;
}

export default function AdminPricingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [marginData, setMarginData] = useState<MarginCalculation[]>([]);
  const [exchangeRate, setExchangeRate] = useState<PricingConfig | null>(null);
  const [aiEngines, setAiEngines] = useState<AiEngine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ type: string; field: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && !user.is_admin) {
      router.push('/');
      showError('Доступ запрещен');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [marginRes, configRes, enginesRes] = await Promise.all([
        api.get('/api/admin/pricing/margin-calculator'),
        api.get('/api/admin/pricing/config'),
        api.get('/api/admin/pricing/engines')
      ]);

      setMarginData(marginRes.data);
      const usdConfig = configRes.data.find((c: PricingConfig) => c.key === 'usd_to_rub_exchange_rate');
      setExchangeRate(usdConfig);
      setAiEngines(enginesRes.data);
    } catch (error: any) {
      console.error('Error fetching pricing data:', error);
      showError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const updateExchangeRate = async (newRate: number) => {
    try {
      await api.patch('/api/admin/pricing/config/usd_to_rub_exchange_rate', {
        value: newRate
      });
      showSuccess('Курс USD/RUB обновлен. Все цены пересчитаны!');
      fetchData();
    } catch (error: any) {
      showError('Ошибка обновления курса');
    }
  };

  const updateEngine = async (engineId: number, field: string, value: number) => {
    try {
      await api.patch(`/api/admin/pricing/engines/${engineId}`, {
        [field]: value
      });
      showSuccess('AI-движок обновлен. Цены пересчитаны!');
      fetchData();
    } catch (error: any) {
      showError('Ошибка обновления движка');
    }
  };

  const getGenerationTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      static_image: 'Статичное изображение',
      animated_image: 'Анимированное изображение',
      video_morph: 'Видео-морфинг',
      contextual_photo: 'Контекстный фото-креатив',
      ai_scoring: 'AI-скоринг',
      vector_creative: 'Векторный креатив (Recraft)',
      branded_set: 'Брендовый Сет (Fusion)'
    };
    return labels[type] || type;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user?.is_admin) {
    return null;
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-accent bg-clip-text text-transparent">
            Калькулятор Маржинальности
          </span>
        </h1>
        <p className="text-text-secondary">
          Управление ценообразованием и маржинальностью платформы
        </p>
      </div>

      {/* Курс USD/RUB */}
      <div className="card-elevated mb-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Глобальные настройки</h2>
        <div className="flex items-center space-x-4">
          <label className="text-text-secondary w-32">Курс USD/RUB:</label>
          <input
            type="number"
            step="0.01"
            value={exchangeRate?.value || 100}
            onChange={(e) => setExchangeRate(prev => prev ? {...prev, value: parseFloat(e.target.value)} : null)}
            className="input-field w-32"
          />
          <button
            onClick={() => exchangeRate && updateExchangeRate(exchangeRate.value)}
            className="btn-primary"
          >
            Обновить курс
          </button>
          <span className="text-sm text-text-muted">
            Обновлено: {exchangeRate ? new Date(exchangeRate.updated_at).toLocaleString('ru-RU') : '—'}
          </span>
        </div>
      </div>

      {/* Таблица маржинальности */}
      <div className="card-elevated p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Расчет маржинальности по типам генерации</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4">Тип генерации</th>
                <th className="text-right py-3 px-4">Себестоимость (USD)</th>
                <th className="text-right py-3 px-4">Себестоимость (₽)</th>
                <th className="text-right py-3 px-4">Наценка (%)</th>
                <th className="text-right py-3 px-4">Цена для клиента (₽)</th>
                <th className="text-right py-3 px-4">Прибыль (₽)</th>
                <th className="text-right py-3 px-4">ROI (%)</th>
              </tr>
            </thead>
            <tbody>
              {marginData.map((item) => (
                <tr key={item.generation_type} className="border-b border-dark-border hover:bg-dark-surface/50">
                  <td className="py-4 px-4 font-semibold">
                    {getGenerationTypeLabel(item.generation_type)}
                  </td>
                  <td className="py-4 px-4 text-right">${item.base_cost_usd.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right">{item.cost_rub.toFixed(2)}₽</td>
                  <td className="py-4 px-4 text-right text-accent-primary font-bold">
                    {item.markup_percentage.toFixed(0)}%
                  </td>
                  <td className="py-4 px-4 text-right text-xl font-bold text-accent-primary">
                    {item.final_price_rub}₽
                  </td>
                  <td className="py-4 px-4 text-right text-green-400 font-semibold">
                    +{item.profit_rub.toFixed(2)}₽
                  </td>
                  <td className="py-4 px-4 text-right text-green-400">
                    {item.profit_percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Управление AI-движками */}
      <div className="card-elevated p-6">
        <h2 className="text-2xl font-bold mb-6">Управление AI-движками</h2>
        <div className="space-y-4">
          {aiEngines.map((engine) => (
            <div key={engine.id} className="p-4 bg-dark-surface rounded-lg border border-dark-border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold">{engine.name}</h3>
                  <p className="text-sm text-text-secondary">{engine.role}</p>
                  <p className="text-xs text-text-muted mt-1">
                    Тип: {engine.generation_type ? getGenerationTypeLabel(engine.generation_type) : 'Не указан'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  engine.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {engine.is_active ? 'Активен' : 'Неактивен'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-text-secondary block mb-2">
                    Себестоимость API (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={engine.internal_cost_usd_per_unit}
                    onChange={(e) => updateEngine(engine.id, 'internal_cost_usd_per_unit', parseFloat(e.target.value))}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary block mb-2">
                    Наценка (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={engine.markup_percentage}
                    onChange={(e) => updateEngine(engine.id, 'markup_percentage', parseFloat(e.target.value))}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

