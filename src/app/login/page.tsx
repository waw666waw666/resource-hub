'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  React.useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email) {
      newErrors.email = '请输入邮箱'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    if (!password) {
      newErrors.password = '请输入密码'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      showToast('success', '登录成功！')
      router.push('/')
    } else {
      showToast('error', result.error || '登录失败')
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)] mb-2">欢迎回来</h1>
            <p className="text-[#615d59]">登录你的账户继续探索</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="邮箱"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              label="密码"
              type="password"
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Button type="submit" className="w-full" loading={loading}>
              登录
            </Button>
          </form>

          <p className="text-center text-sm text-[#615d59] mt-6">
            还没有账户？{' '}
            <Link href="/register" className="text-notion-blue hover:underline">
             立即注册
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
