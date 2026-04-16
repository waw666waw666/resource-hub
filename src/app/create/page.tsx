'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { X, Plus } from 'lucide-react'

export default function CreateResourcePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

  useEffect(() => {
    if (!authLoading && !user) {
      showToast('warning', '请先登录')
      router.push('/login')
    }
  }, [user, authLoading, router, showToast])

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {}
    if (!title.trim()) {
      newErrors.title = '请输入标题'
    }
    if (!content.trim()) {
      newErrors.content = '请输入内容'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          coverImage: coverImage.trim() || null,
          tags,
        }),
      })

      const data = await res.json()

      if (data.success) {
        showToast('success', '发布成功！')
        router.push(`/resources/${data.data.id}`)
      } else {
        showToast('error', data.error || '发布失败')
      }
    } catch (error) {
      console.error('Create resource error:', error)
      showToast('error', '发布失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
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

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)] mb-8">
            发布新资源
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="标题"
              placeholder="给资源起个标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            <Textarea
              label="简介"
              placeholder="简要描述这个资源（可选）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />

            <Textarea
              label="内容"
              placeholder="详细描述这个资源..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={errors.content}
              rows={12}
            />

            <Input
              label="封面图片 URL"
              placeholder="https://example.com/image.jpg（可选）"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-1.5">
                标签（最多5个）
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="输入标签"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  className="flex-1 px-3 py-2 text-base border border-[#dddddd] rounded bg-white text-[rgba(0,0,0,0.9)] placeholder-[#a39e98] focus:outline-none focus:ring-2 focus:ring-notion-blue focus:border-transparent"
                  disabled={tags.length >= 5}
                />
                <Button type="button" variant="secondary" onClick={addTag} disabled={tags.length >= 5}>
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-[#f2f9ff] text-[#097fe8] rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" loading={submitting}>
                发布
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                取消
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
