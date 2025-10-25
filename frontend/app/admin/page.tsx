'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { 
  FaChartLine, FaUsers, FaMoneyBillWave, FaExclamationTriangle,
  FaSpinner, FaCog, FaCheckCircle, FaCrown
} from 'react-icons/fa';

interface DashboardStats {
  total_users: number;
  active_subscriptions: number;
  mrr: number;
  monthly_revenue: number;
  monthly_generations: number;
  expiring_subscriptions: number;
}

interface Alert {
  expired_subscriptions: number;
  low_credit_premium_users: number;
  pending_moderations: number;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'pricing'>('dashboard');

  useEffect(() => {
    if (!authLoading && (!user || !user.is_admin)) {
      router.push('/');
    } else if (user?.is_admin) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAlerts()
      ]);
      setStats(statsRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-accent-primary" />
      </div>
    );
  }

  if (!user?.is_admin) return null;

  return (
    <div className="min-h-screen py-12 px-4 bg-dark-bg">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
            <FaCrown className="text-accent-purple" />
            <span>Админ-панель</span>
          </h1>
          <p className="text-text-secondary">Управление платформой и аналитика</p>
        </div>

        {/* Alerts */}
        {alerts && (alerts.expired_subscriptions > 0 || alerts.low_credit_premium_users > 0 || alerts.pending_moderations > 0) && (
          <div className="card bg-accent-danger/20 border-accent-danger mb-8">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-accent-danger text-2xl mt-1" />
              <div className="flex-grow">
                <h3 className="font-bold text-lg mb-2">Сигналы тревоги</h3>
                <div className="space-y-1 text-sm">
                  {alerts.expired_subscriptions > 0 && (
                    <p>⚠️ Просроченных подписок: {alerts.expired_subscriptions}</p>
                  )}
                  {alerts.low_credit_premium_users > 0 && (
                    <p>💳 Премиум-пользователей с низким балансом: {alerts.low_credit_premium_users}</p>
                  )}
                  {alerts.pending_moderations > 0 && (
                    <p>📋 Креативов на модерации: {alerts.pending_moderations}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-dark-border">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FaChartLine className="inline mr-2" />
            Дашборд
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'users'
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FaUsers className="inline mr-2" />
            Пользователи
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'pricing'
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FaCog className="inline mr-2" />
            Настройки цен
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-elevated">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Всего пользователей</p>
                    <p className="text-4xl font-bold">{stats.total_users}</p>
                  </div>
                  <div className="w-16 h-16 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                    <FaUsers className="text-3xl text-accent-primary" />
                  </div>
                </div>
              </div>

              <div className="card-elevated">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Активных подписок</p>
                    <p className="text-4xl font-bold text-accent-secondary">{stats.active_subscriptions}</p>
                  </div>
                  <div className="w-16 h-16 bg-accent-secondary/20 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="text-3xl text-accent-secondary" />
                  </div>
                </div>
              </div>

              <div className="card-elevated">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">MRR (Monthly Recurring)</p>
                    <p className="text-4xl font-bold text-accent-purple">
                      {stats.mrr.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-accent-purple/20 rounded-lg flex items-center justify-center">
                    <FaMoneyBillWave className="text-3xl text-accent-purple" />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="font-semibold mb-2 text-text-secondary">Выручка за месяц</h3>
                <p className="text-2xl font-bold text-accent-secondary">
                  {stats.monthly_revenue.toLocaleString('ru-RU')} ₽
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-2 text-text-secondary">Генераций за месяц</h3>
                <p className="text-2xl font-bold">{stats.monthly_generations}</p>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-2 text-text-secondary">Подписок истекает скоро</h3>
                <p className="text-2xl font-bold text-accent-danger">{stats.expiring_subscriptions}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Быстрые действия</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="btn btn-secondary text-left px-6 py-4">
                  <FaUsers className="inline mr-2" />
                  Управление пользователями
                </button>
                <button className="btn btn-secondary text-left px-6 py-4">
                  <FaCog className="inline mr-2" />
                  Настройка цен
                </button>
                <button className="btn btn-secondary text-left px-6 py-4">
                  <FaCheckCircle className="inline mr-2" />
                  Модерация креативов
                </button>
                <button className="btn btn-secondary text-left px-6 py-4">
                  <FaChartLine className="inline mr-2" />
                  Полная аналитика
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Управление пользователями</h3>
            <p className="text-text-secondary mb-6">
              Здесь будет таблица со всеми пользователями, фильтрами и возможностью редактирования
            </p>
            <div className="bg-dark-elevated rounded-lg p-8 text-center">
              <FaUsers className="text-6xl text-accent-primary mx-auto mb-4" />
              <p className="text-text-secondary">Функционал в разработке</p>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Управление ценами</h3>
            <p className="text-text-secondary mb-6">
              Настройка стоимости генераций, подписок и пакетов кредитов
            </p>
            <div className="bg-dark-elevated rounded-lg p-8 text-center">
              <FaCog className="text-6xl text-accent-purple mx-auto mb-4" />
              <p className="text-text-secondary">Функционал в разработке</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

