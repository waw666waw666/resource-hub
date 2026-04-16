import type { Metadata } from 'next'
import { AuthProvider } from '@/hooks/useAuth'
import { ToastProvider } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'ResourceHub - 资源分享平台',
  description: '一个温暖、简洁的资源分享平台，发现和分享有价值的资源',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-[100dvh] flex flex-col">
        <AuthProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
