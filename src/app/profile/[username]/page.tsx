'use client'

import React, { useState, useEffect, use } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ResourceCard } from '@/components/ResourceCard'
import { useAuth } from '@/hooks/useAuth'
import { User as UserIcon, Calendar } from 'lucide-react'
import Image from 'next/image'
import { Resource } from '@/types'

interface UserProfile {
  id: string
  username: string
  avatar?: string
  createdAt: string
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${username}`)
        const data = await res.json()
        if (data.success) {
          setProfile(data.data.profile)
          setResources(data.data.resources)
        }
      } catch (error) {
        console.error('Fetch profile error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-[#615d59]">加载中...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)] mb-2}>用户不存在</h1>
            <p className="text-[#615d59]">该用户可能已被删除或不存在</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-[#f6f5f4] rounded-card-lg p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.username}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-[#a39e98]" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)] mb-2">
                  {profile.username}
                </h1>
                <p className="text-sm text-[#615d59] flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  加入于 {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[rgba(0,0,0,0.95)]">
              发布的资源 ({resources.length})
            </h2>
          </div>

          {resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#f6f5f4] rounded-lg">
              <p className="text-[#615d59]">该用户还没有发布任何资源</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
