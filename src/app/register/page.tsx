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

export default function RegisterPage() {
  const router = useRouter()
  const { register, user } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    username?: string
    password?: string
    confirmPassword?: string
  }>({})

  React.useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!email) {
      newErrors.email = '请输入邮箱'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    if (!username) {
      newErrors.username = '请输入用户名'
    } else if (username.length < 3) {
      newErrors.username = '用户名至少需要3个字符'
    }
    if (!password) {
      newErrors.password = '请输入密码'
    } else if (password.length < 6) {
      newErrors.password = '密码至少需要6个字符'
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const result = await register(email, username, password)
    setLoading(false)

    if (result.success) {
      showToast('success', '注册成功！')
      router.push('/')
    } else {
      showToast('error', result.error || '注册失败')
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)] mb-2">创建账户</h1>
            <p className="text-[#615d59]">加入社区，开始分享</p>
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
              label="用户名"
              type="text"
              placeholder="选择一个用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />

            <Input
              label="密码"
              type="password"
              placeholder="至少6个字符"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Input
              label="确认密码"
              type="password"
              placeholder="再次输入密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />

            <Button type="submit" className="w-full" loading={loading}>
              注册
            </Button>
          </form>

          <p className="text-center text-sm text-[#615d59] mt-6">
            已有账户？{' '}
            <Link href="/login" className="text-notion-blue hover:underline">
              立即登录
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
