'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, User } from 'lucide-react'
import { Resource } from '@/types'

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins} 分钟前`
    if (diffHours < 24) return `${diffHours} 小时前`
    if (diffDays < 7) return `${diffDays} 天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <Link href={`/resources/${resource.id}`}>
      <article className="bg-white rounded-card border border-[rgba(0,0,0,0.1)] overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer group">
        {resource.coverImage && (
          <div className="relative h-40 bg-[#f6f5f4] overflow-hidden">
            <Image
              src={resource.coverImage}
              alt={resource.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.95)] line-clamp-2 mb-2 group-hover:text-notion-blue transition-colors">
            {resource.title}
          </h3>
          {resource.description && (
            <p className="text-sm text-[#615d59] line-clamp-2 mb-3">
              {resource.description}
            </p>
          )}
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-medium bg-[#f2f9ff] text-[#097fe8] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#f6f5f4] flex items-center justify-center overflow-hidden">
                {resource.author.avatar ? (
                  <Image
                    src={resource.author.avatar}
                    alt={resource.author.username}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User className="w-3 h-3 text-[#a39e98]" />
                )}
              </div>
              <span className="text-xs text-[#615d59]">
                {resource.author.username}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#a39e98]">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {resource.likesCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {resource.commentsCount}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#a39e98] mt-2">
            {formatDate(resource.createdAt)}
          </p>
        </div>
      </article>
    </Link>
  )
}
