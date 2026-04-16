'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from './ui/Button'
import { PenLine, LogOut, User as UserIcon } from 'lucide-react'

export function Header() {
  const { user, loading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-notion-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="text-xl font-semibold text-[rgba(0,0,0,0.95)] hidden sm:block">
            ResourceHub
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-[#615d59] hover:text-[rgba(0,0,0,0.95)] transition-colors"
          >
            首页
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/create">
                    <Button variant="ghost" size="sm">
                      <PenLine className="w-4 h-4 mr-1" />
                      发布
                    </Button>
                  </Link>
                  <Link href={`/profile/${user.username}`}>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.08)] transition-colors">
                      <UserIcon className="w-4 h-4 text-[#615d59]" />
                      <span className="text-sm font-medium text-[rgba(0,0,0,0.95)]">
                        {user.username}
                      </span>
                    </div>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">登录</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">注册</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
