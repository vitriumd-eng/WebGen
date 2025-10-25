'use client';

import { useState, useEffect } from 'react';
import { libraryAPI } from '@/lib/api';
import { TopCreative } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { FaStar, FaEye, FaUnlock, FaFilter, FaSpinner, FaLock } from 'react-icons/fa';

export default function LibraryPage() {
  const { user, refreshUser } = useAuth();
  const [creatives, setCreatives] = useState<TopCreative[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState<number | null>(null);
  const [unlockedCreatives, setUnlockedCreatives] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [creativesRes, categoriesRes] = await Promise.all([
        libraryAPI.getTopCreatives(0, 50, selectedCategory || undefined),
        libraryAPI.getCategories()
      ]);
      setCreatives(creativesRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Failed to load library', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (creativeId: number) => {
    if (!user) {
      alert('Войдите, чтобы разблокировать детали');
      return;
    }

    setUnlocking(creativeId);
    try {
      const response = await libraryAPI.unlockCreative(creativeId);
      setUnlockedCreatives(prev => new Set(prev).add(creativeId));
      
      // Update the creative in the list with full details
      setCreatives(prev => prev.map(c => 
        c.id === creativeId ? response.data : c
      ));
      
      await refreshUser();
      alert('Детали креатива разблокированы!');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка разблокировки');
    } finally {
      setUnlocking(null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Библиотека Топ-Креативов</h1>
          <p className="text-text-secondary">
            Изучайте лучшие креативы с высоким AI-скорингом. Разблокируйте промпты за 5 кредитов
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-accent-primary" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input flex-grow"
            >
              <option value="">Все категории</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Creatives Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-accent-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatives.map((creative) => {
              const isUnlocked = unlockedCreatives.has(creative.id) || creative.prompt;
              
              return (
                <div key={creative.id} className="card-elevated group">
                  {/* Preview Image Placeholder */}
                  <div className="w-full h-48 bg-dark-elevated rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-accent opacity-20"></div>
                    <span className="text-6xl relative z-10">🎨</span>
                  </div>

                  {/* Title & Category */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold mb-1 line-clamp-1">{creative.title}</h3>
                    {creative.category && (
                      <span className="badge badge-primary text-xs">{creative.category}</span>
                    )}
                  </div>

                  {/* Description */}
                  {creative.description && (
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {creative.description}
                    </p>
                  )}

                  {/* AI Score */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-accent-secondary" />
                      <span className="font-bold text-accent-secondary">{creative.ai_score}/100</span>
                    </div>
                    <div className="flex items-center space-x-4 text-text-muted text-sm">
                      <span className="flex items-center space-x-1">
                        <FaEye />
                        <span>{creative.views_count}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FaUnlock />
                        <span>{creative.unlocks_count}</span>
                      </span>
                    </div>
                  </div>

                  {/* Prompt Section */}
                  {isUnlocked ? (
                    <div className="bg-dark-elevated rounded-lg p-4 border border-accent-secondary">
                      <p className="text-xs text-text-secondary mb-2">Промпт:</p>
                      <p className="text-sm">{creative.prompt || 'Промпт загружается...'}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUnlock(creative.id)}
                      disabled={unlocking === creative.id}
                      className="btn btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {unlocking === creative.id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Разблокировка...</span>
                        </>
                      ) : (
                        <>
                          <FaLock />
                          <span>Разблокировать за {creative.unlock_cost} кредитов</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && creatives.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg mb-4">
              {selectedCategory ? 'В этой категории пока нет креативов' : 'Библиотека пуста'}
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="btn btn-primary"
              >
                Сбросить фильтр
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

