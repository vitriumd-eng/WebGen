'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaLock } from 'react-icons/fa';
import OAuthButtons from '@/components/OAuthButtons';
import { showSuccess, showError } from '@/lib/toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      showSuccess('Вход выполнен успешно!');
      router.push('/generate');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Ошибка входа. Проверьте данные.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Вход</h1>
          <p className="text-text-secondary">Войдите в свой аккаунт</p>
        </div>

        <div className="card-elevated">
          {/* OAuth Login Buttons */}
          <div className="mb-6">
            <p className="text-text-secondary text-sm text-center mb-4">
              Войти через социальные сети
            </p>
            <OAuthButtons />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-elevated text-text-secondary">или войти с паролем</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-accent-danger/20 border border-accent-danger rounded-lg p-4 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Имя пользователя</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Нет аккаунта?{' '}
              <Link href="/register" className="text-accent-primary hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <div className="mt-4 border-t border-dark-border pt-4">
            <p className="text-text-muted text-xs text-center">
              Тестовые данные: <br />
              username: <code className="bg-dark-elevated px-2 py-1 rounded">testuser</code> / 
              password: <code className="bg-dark-elevated px-2 py-1 rounded">test123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

