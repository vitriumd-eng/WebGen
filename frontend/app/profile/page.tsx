'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { generationAPI, paymentAPI } from '@/lib/api';
import { Generation } from '@/lib/types';
import { 
  FaUser, FaCrown, FaCoins, FaHistory, FaChartBar, 
  FaSpinner, FaCalendar, FaCheckCircle, FaTimesCircle 
} from 'react-icons/fa';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'stats'>('overview');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const genResponse = await generationAPI.getMyGenerations(0, 50);
      setGenerations(genResponse.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (tier: string) => {
    const tiers = {
      free: { name: 'Free', icon: '🆓', color: 'text-gray-400', bgColor: 'bg-gray-400/20' },
      starter: { name: 'Starter', icon: '⭐', color: 'text-blue-400', bgColor: 'bg-blue-400/20' },
      pro: { name: 'Pro', icon: '💎', color: 'text-purple-400', bgColor: 'bg-purple-400/20' },
      agency: { name: 'Agency', icon: '👑', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' },
    };
    return tiers[tier as keyof typeof tiers] || tiers.free;
  };

  const getStats = () => {
    const completed = generations.filter(g => g.status === 'completed').length;
    const failed = generations.filter(g => g.status === 'failed').length;
    const totalSpent = generations
      .filter(g => g.status === 'completed')
      .reduce((sum, g) => sum + g.cost, 0);

    return { completed, failed, totalSpent };
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-accent-primary" />
      </div>
    );
  }

  if (!user) return null;

  const tierInfo = getTierInfo(user.subscription_tier);
  const stats = getStats();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
          <p className="text-text-secondary">Управление аккаунтом и статистика</p>
        </div>

        {/* Profile Card */}
        <div className="card-elevated mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center text-3xl">
                <FaUser className="text-dark-bg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.full_name || user.username}</h2>
                <p className="text-text-secondary">@{user.username}</p>
                <p className="text-text-muted text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className={`${tierInfo.bgColor} ${tierInfo.color} px-4 py-2 rounded-lg text-center font-bold`}>
                <span className="mr-2">{tierInfo.icon}</span>
                {tierInfo.name}
              </div>
              <div className="bg-accent-secondary/20 text-accent-secondary px-4 py-2 rounded-lg text-center font-bold">
                <FaCoins className="inline mr-2" />
                {user.credits_balance} кредитов
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-dark-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FaChartBar className="inline mr-2" />
            Обзор
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'history'
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FaHistory className="inline mr-2" />
            История
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'stats'
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FaChartBar className="inline mr-2" />
            Статистика
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-elevated">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Всего генераций</p>
                    <p className="text-3xl font-bold">{generations.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="text-2xl text-accent-primary" />
                  </div>
                </div>
              </div>

              <div className="card-elevated">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Успешных</p>
                    <p className="text-3xl font-bold text-accent-secondary">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-secondary/20 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="text-2xl text-accent-secondary" />
                  </div>
                </div>
              </div>

              <div className="card-elevated">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Потрачено кредитов</p>
                    <p className="text-3xl font-bold text-accent-purple">{stats.totalSpent}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-purple/20 rounded-lg flex items-center justify-center">
                    <FaCoins className="text-2xl text-accent-purple" />
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <FaCrown className="text-accent-secondary" />
                <span>Подписка</span>
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold mb-1">
                    Тариф: <span className={tierInfo.color}>{tierInfo.name}</span>
                  </p>
                  <p className="text-text-secondary text-sm">
                    {user.subscription_tier === 'free' 
                      ? 'Обновите тариф для доступа к премиум-функциям'
                      : 'Доступ ко всем премиум-функциям'
                    }
                  </p>
                </div>
                {user.subscription_tier === 'free' && (
                  <a href="/pricing" className="btn btn-primary">
                    Обновить тариф
                  </a>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="/generate" className="card-elevated hover:scale-105 transition-transform">
                <h3 className="text-xl font-bold mb-2">Создать креатив</h3>
                <p className="text-text-secondary text-sm">
                  Начните генерацию нового контента
                </p>
              </a>
              <a href="/pricing" className="card-elevated hover:scale-105 transition-transform">
                <h3 className="text-xl font-bold mb-2">Пополнить баланс</h3>
                <p className="text-text-secondary text-sm">
                  Купите кредиты или обновите подписку
                </p>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">История генераций</h3>
              {generations.length > 0 ? (
                <div className="space-y-3">
                  {generations.map((gen) => (
                    <div key={gen.id} className="bg-dark-elevated rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{gen.type.replace('_', ' ')}</h4>
                          {gen.prompt && (
                            <p className="text-text-secondary text-sm mt-1 line-clamp-1">
                              {gen.prompt}
                            </p>
                          )}
                        </div>
                        <span className={`badge ${
                          gen.status === 'completed' ? 'badge-success' : 
                          gen.status === 'failed' ? 'bg-accent-danger/20 text-accent-danger' : 
                          'badge-primary'
                        }`}>
                          {gen.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">
                          <FaCalendar className="inline mr-1" />
                          {new Date(gen.created_at).toLocaleString('ru-RU')}
                        </span>
                        <span className="text-accent-primary font-bold">
                          {gen.cost} кредитов
                        </span>
                      </div>
                      {gen.ai_score && (
                        <div className="mt-2 text-sm">
                          <span className="text-text-secondary">AI Score: </span>
                          <span className="text-accent-secondary font-bold">{gen.ai_score}/100</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary mb-4">У вас пока нет генераций</p>
                  <a href="/generate" className="btn btn-primary">
                    Создать первый креатив
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Детальная статистика</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-dark-border">
                  <span className="text-text-secondary">Успешных генераций</span>
                  <span className="font-bold text-accent-secondary">{stats.completed}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-dark-border">
                  <span className="text-text-secondary">Неудачных генераций</span>
                  <span className="font-bold text-accent-danger">{stats.failed}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-dark-border">
                  <span className="text-text-secondary">Всего потрачено кредитов</span>
                  <span className="font-bold text-accent-purple">{stats.totalSpent}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-dark-border">
                  <span className="text-text-secondary">Средняя стоимость генерации</span>
                  <span className="font-bold">
                    {stats.completed > 0 ? Math.round(stats.totalSpent / stats.completed) : 0} кредитов
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-text-secondary">Текущий баланс</span>
                  <span className="font-bold text-accent-secondary">{user.credits_balance} кредитов</span>
                </div>
              </div>
            </div>

            {/* Types breakdown */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Генерации по типам</h3>
              <div className="space-y-3">
                {Object.entries(
                  generations.reduce((acc, gen) => {
                    acc[gen.type] = (acc[gen.type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-text-secondary">{type.replace('_', ' ')}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

