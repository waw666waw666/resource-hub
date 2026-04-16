'use client'

import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CommentItem } from '@/components/CommentItem'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Resource, Comment } from '@/types'
import { Heart, MessageCircle, ArrowLeft, User, Calendar, Edit, Trash2 } from 'lucide-react'

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [resource, setResource] = useState<Resource | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [liking, setLiking] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  const fetchResource = async () => {
    try {
      const res = await fetch(`/api/resources/${id}`)
      const data = await res.json()
      if (data.success) {
        setResource(data.data)
      } else {
        showToast('error', '资源不存在')
        router.push('/')
      }
    } catch (error) {
      console.error('Fetch resource error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/resources/${id}/comments`)
      const data = await res.json()
      if (data.success) {
        setComments(data.data)
      }
    } catch (error) {
      console.error('Fetch comments error:', error)
    }
  }

  useEffect(() => {
    fetchResource()
    fetchComments()
  }, [id])

  const handleLike = async () => {
    if (!user) {
      showToast('warning', '请先登录')
      return
    }
    if (liking) return

    setLiking(true)
    try {
      const res = await fetch(`/api/resources/${id}/like`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setResource((prev) =>
          prev
            ? {
                ...prev,
                userLiked: data.data.liked,
                likesCount: data.data.likesCount,
              }
            : null
        )
      }
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setLiking(false)
    }
  }

  const handleComment = async (parentId: string | null, content: string) => {
    if (!user) {
      showToast('warning', '请先登录')
      return
    }

    setSubmittingComment(true)
    try {
      const res = await fetch(`/api/resources/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('success', '评论成功')
        fetchComments()
        setResource((prev) =>
          prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null
        )
      } else {
        showToast('error', data.error || '评论失败')
      }
    } catch (error) {
      console.error('Comment error:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这个资源吗？')) return

    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast('success', '删除成功')
        router.push('/')
      } else {
        showToast('error', data.error || '删除失败')
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

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

  if (!resource) {
    return null
  }

  const isAuthor = user?.id === resource.author.id

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#615d59] hover:text-notion-blue transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>

          {resource.coverImage && (
            <div className="relative w-full h-64 md:h-80 rounded-card-lg overflow-hidden mb-8">
              <Image
                src={resource.coverImage}
                alt={resource.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <article>
            <h1 className="text-3xl md:text-4xl font-bold text-[rgba(0,0,0,0.95)] tracking-tight mb-4">
              {resource.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <Link
                href={`/profile/${resource.author.username}`}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#f6f5f4] flex items-center justify-center overflow-hidden">
                  {resource.author.avatar ? (
                    <Image
                      src={resource.author.avatar}
                      alt={resource.author.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-[#a39e98]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[rgba(0,0,0,0.95)]">
                    {resource.author.username}
                  </p>
                  <p className="text-xs text-[#a39e98] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(resource.createdAt)}
                  </p>
                </div>
              </Link>

              {isAuthor && (
                <div className="flex items-center gap-2 ml-auto">
                  <Link href={`/resources/${id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    删除
                  </Button>
                </div>
              )}
            </div>

            {resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium bg-[#f2f9ff] text-[#097fe8] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[rgba(0,0,0,0.1)]">
              <Button
                variant={resource.userLiked ? 'primary' : 'secondary'}
                size="sm"
                onClick={handleLike}
                loading={liking}
              >
                <Heart className={`w-4 h-4 mr-1 ${resource.userLiked ? 'fill-current' : ''}`} />
                {resource.likesCount} 点赞
              </Button>
              <span className="flex items-center gap-1 text-sm text-[#615d59]">
                <MessageCircle className="w-4 h-4" />
                {resource.commentsCount} 评论
              </span>
            </div>

            {resource.description && (
              <p className="text-lg text-[#615d59] mb-6">{resource.description}</p>
            )}

            <div className="prose prose-lg max-w-none mb-12">
              <div className="whitespace-pre-wrap text-[rgba(0,0,0,0.9)] leading-relaxed">
                {resource.content}
              </div>
            </div>
          </article>

          <section className="border-t border-[rgba(0,0,0,0.1)] pt-8">
            <h2 className="text-xl font-bold text-[rgba(0,0,0,0.95)] mb-6">
              评论 ({resource.commentsCount})
            </h2>

            {user ? (
              <div className="mb-8">
                <Textarea
                  placeholder="写下你的评论..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    onClick={() => handleComment(null, commentContent)}
                    loading={submittingComment}
                    disabled={!commentContent.trim()}
                  >
                    发布评论
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-[#f6f5f4] rounded-lg text-center">
                <p className="text-[#615d59] mb-2}>登录后才能评论</p>
                <Link href="/login">
                  <Button variant="primary" size="sm">登录</Button>
                </Link>
              </div>
            )}

            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={handleComment}
                />
              ))}

              {comments.length === 0 && (
                <p className="text-center text-[#a39e98] py-8">
                  还没有评论，快来抢沙发吧！
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
