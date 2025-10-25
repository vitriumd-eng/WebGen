'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { paymentAPI } from '@/lib/api';
import { SubscriptionPlan, CreditPackage } from '@/lib/types';
import { FaCheck, FaCrown, FaCoins, FaSpinner } from 'react-icons/fa';

export default function PricingPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansRes, packagesRes] = await Promise.all([
        paymentAPI.getSubscriptionPlans(),
        paymentAPI.getCreditPackages()
      ]);
      setPlans(plansRes.data);
      setPackages(packagesRes.data);
    } catch (err) {
      console.error('Failed to load pricing', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSubscription = async (tier: string) => {
    if (!user) {
      alert('Войдите, чтобы оформить подписку');
      return;
    }

    setPurchasing(`sub_${tier}`);
    try {
      const response = await paymentAPI.createPayment({ type: 'subscription', tier });
      // Открываем mock платежную страницу
      alert(`Mock: Переход на страницу оплаты\n${response.data.confirmation_url}\n\nВ продакшене здесь будет реальная интеграция с ЮКassa`);
      
      // Simulate successful payment for demo
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка создания платежа');
    } finally {
      setPurchasing(null);
    }
  };

  const handlePurchaseCredits = async (packageId: number) => {
    if (!user) {
      alert('Войдите, чтобы купить кредиты');
      return;
    }

    setPurchasing(`pkg_${packageId}`);
    try {
      const response = await paymentAPI.createPayment({ type: 'credits', package_id: packageId });
      alert(`Mock: Переход на страницу оплаты\n${response.data.confirmation_url}`);
      
      // Simulate successful payment for demo
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка создания платежа');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-accent-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Тарифы и цены</h1>
          <p className="text-text-secondary text-xl">
            Выберите подходящий тариф или пополните баланс кредитов
          </p>
          {user && (
            <p className="text-accent-secondary font-bold mt-4">
              Ваш баланс: {user.credits_balance} кредитов
            </p>
          )}
        </div>

        {/* Subscription Plans */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-2">
            <FaCrown className="text-accent-secondary" />
            <span>Подписки</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = user?.subscription_tier === plan.tier;
              const isPremium = plan.tier === 'starter' || plan.tier === 'pro';
              
              return (
                <div
                  key={plan.tier}
                  className={`card ${
                    isPremium ? 'border-2 border-accent-primary' : 'border-2 border-dark-border'
                  } relative`}
                >
                  {isPremium && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="badge badge-primary">Популярный</span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-4xl font-bold">{plan.price.toLocaleString('ru-RU')}</span>
                      <span className="text-text-secondary">₽</span>
                    </div>
                    {plan.price > 0 && (
                      <p className="text-text-secondary text-sm mt-1">в месяц</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="bg-accent-secondary/20 rounded-lg p-3 text-center">
                      <p className="text-accent-secondary font-bold text-lg">
                        {plan.credits.toLocaleString('ru-RU')} кредитов
                      </p>
                      <p className="text-text-secondary text-xs mt-1">
                        {plan.price > 0 ? 'ежемесячно' : 'для тестирования'}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <FaCheck className="text-accent-secondary mt-1 flex-shrink-0" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <div className="btn btn-secondary w-full text-center cursor-default">
                      Текущий тариф
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchaseSubscription(plan.tier)}
                      disabled={purchasing !== null || !user}
                      className="btn btn-primary w-full disabled:opacity-50"
                    >
                      {purchasing === `sub_${plan.tier}` ? (
                        <span className="flex items-center justify-center space-x-2">
                          <FaSpinner className="animate-spin" />
                          <span>Оформление...</span>
                        </span>
                      ) : plan.price === 0 ? (
                        'Начать'
                      ) : (
                        'Выбрать'
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Credit Packages */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-2">
            <FaCoins className="text-accent-secondary" />
            <span>Пакеты кредитов</span>
          </h2>
          
          <p className="text-center text-text-secondary mb-8">
            Покупайте кредиты с бонусами. <strong>1 кредит = 1 рубль</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => {
              const totalCredits = pkg.credits_amount + (pkg.credits_amount * pkg.bonus_percent / 100);
              const savings = pkg.credits_amount - pkg.price_rub;
              
              return (
                <div key={pkg.id} className="card-elevated">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                    {pkg.bonus_percent > 0 && (
                      <span className="badge badge-success text-xs">
                        +{pkg.bonus_percent}% бонус
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold mb-1">
                      {pkg.price_rub.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-accent-secondary font-bold text-lg">
                      {totalCredits.toLocaleString('ru-RU')} кредитов
                    </div>
                    {pkg.bonus_percent > 0 && (
                      <p className="text-text-muted text-xs mt-1">
                        {pkg.credits_amount} + {pkg.credits_amount * pkg.bonus_percent / 100} бонус
                      </p>
                    )}
                  </div>

                  {savings > 0 && (
                    <div className="bg-accent-secondary/20 rounded-lg p-2 mb-4 text-center">
                      <p className="text-accent-secondary text-sm font-bold">
                        Экономия {savings} ₽
                      </p>
                    </div>
                  )}

                  {pkg.description && (
                    <p className="text-text-secondary text-sm mb-4">{pkg.description}</p>
                  )}

                  <button
                    onClick={() => handlePurchaseCredits(pkg.id)}
                    disabled={purchasing !== null || !user}
                    className="btn btn-primary w-full disabled:opacity-50"
                  >
                    {purchasing === `pkg_${pkg.id}` ? (
                      <span className="flex items-center justify-center space-x-2">
                        <FaSpinner className="animate-spin" />
                        <span>Покупка...</span>
                      </span>
                    ) : (
                      'Купить'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Info */}
        <section className="mt-16">
          <div className="card bg-dark-surface text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Как работают кредиты?</h3>
            <div className="space-y-3 text-text-secondary">
              <p>💰 <strong>1 кредит = 1 рубль</strong></p>
              <p>✨ Кредиты списываются только за успешную генерацию</p>
              <p>🎁 Бонусные кредиты при покупке больших пакетов</p>
              <p>♾️ Кредиты не сгорают и переносятся на следующий период</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

