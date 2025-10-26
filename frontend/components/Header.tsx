'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaCoins, FaCrown, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  const { user, logout } = useAuth();

  const getTierBadge = (tier: string) => {
    const badges = {
      free: { color: 'text-gray-400', icon: '🆓', name: 'Free' },
      starter: { color: 'text-blue-400', icon: '⭐', name: 'Starter' },
      pro: { color: 'text-purple-400', icon: '💎', name: 'Pro' },
      agency: { color: 'text-yellow-400', icon: '👑', name: 'Agency' },
    };
    return badges[tier as keyof typeof badges] || badges.free;
  };

  const tierInfo = user ? getTierBadge(user.subscription_tier) : null;

  return (
    <header className="bg-dark-surface border-b border-dark-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Fortar
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/generate" className="hover:text-accent-primary transition-colors">
              Генерация
            </Link>
            <Link href="/library" className="hover:text-accent-primary transition-colors">
              Библиотека
            </Link>
            <Link href="/pricing" className="hover:text-accent-primary transition-colors">
              Тарифы
            </Link>
            {user?.is_admin && (
              <Link href="/admin" className="hover:text-accent-purple transition-colors">
                Админ
              </Link>
            )}
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Credits Balance */}
                <div className="card-elevated px-4 py-2 flex items-center space-x-2 animate-glow">
                  <FaCoins className="text-accent-secondary" />
                  <span className="font-bold text-lg">{user.credits_balance}</span>
                  <span className="text-text-secondary text-sm">кредитов</span>
                </div>

                {/* Subscription Tier */}
                <div className={`badge badge-purple flex items-center space-x-1`}>
                  <span>{tierInfo?.icon}</span>
                  <span className={tierInfo?.color}>{tierInfo?.name}</span>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <Link href="/profile" className="btn btn-secondary px-3 py-2">
                    <FaUser className="text-lg" />
                  </Link>
                  <button onClick={logout} className="btn btn-secondary px-3 py-2 hover:bg-accent-danger">
                    <FaSignOutAlt className="text-lg" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="btn btn-secondary">
                  Вход
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

