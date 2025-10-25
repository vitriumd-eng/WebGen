import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'AI Creatives - Генератор креативов для таргетологов',
  description: 'Создавайте профессиональные креативы для таргетированной рекламы с помощью AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1c1f26',
                color: '#fff',
                border: '1px solid #2a2d35',
              },
              success: {
                iconTheme: {
                  primary: '#00ff88',
                  secondary: '#1c1f26',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff4444',
                  secondary: '#1c1f26',
                },
              },
            }}
          />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

