'use client';

import Link from 'next/link';
import { FaTelegram, FaEnvelope, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-light-surface border-t border-light-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-soft">
                <span className="text-xl font-bold text-white">F</span>
              </div>
              <span className="text-lg font-bold text-text-primary">Fortar</span>
            </div>
            <p className="text-text-secondary text-sm">
              AI-платформа для анализа конкурентов и генерации нативных креативов
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4 text-text-primary">Продукт</h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li><Link href="/generate" className="hover:text-accent-primary transition-colors">Генерация</Link></li>
              <li><Link href="/library" className="hover:text-accent-primary transition-colors">Библиотека</Link></li>
              <li><Link href="/pricing" className="hover:text-accent-primary transition-colors">Тарифы</Link></li>
              <li><Link href="/docs" className="hover:text-accent-primary transition-colors">Документация</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-text-primary">Компания</h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li><Link href="/about" className="hover:text-accent-primary transition-colors">О нас</Link></li>
              <li><Link href="/contact" className="hover:text-accent-primary transition-colors">Контакты</Link></li>
              <li><Link href="/privacy" className="hover:text-accent-primary transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="/terms" className="hover:text-accent-primary transition-colors">Условия использования</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-text-primary">Связаться</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-light-bg border border-light-border rounded-lg flex items-center justify-center hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all shadow-soft">
                <FaTelegram className="text-xl" />
              </a>
              <a href="mailto:support@example.com" className="w-10 h-10 bg-light-bg border border-light-border rounded-lg flex items-center justify-center hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all shadow-soft">
                <FaEnvelope className="text-xl" />
              </a>
              <a href="#" className="w-10 h-10 bg-light-bg border border-light-border rounded-lg flex items-center justify-center hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all shadow-soft">
                <FaGithub className="text-xl" />
              </a>
            </div>
            <p className="text-text-secondary text-sm mt-4">
              support@fortar.ru
            </p>
          </div>
        </div>

        <div className="border-t border-light-border mt-8 pt-8 text-center text-text-secondary text-sm">
          <p>© 2025 Fortar. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

