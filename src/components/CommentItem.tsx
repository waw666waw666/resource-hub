'use client'

import React, { useState } from 'react'
import { User, Heart, Reply, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { Comment } from '@/types'
import { Button } from './ui/Button'
import { Textarea } from './ui/Input'

interface CommentItemProps {
  comment: Comment
  onReply: (parentId: string, content: string) => Promise<void>
  isReply?: boolean
}

export function CommentItem({ comment, onReply, isReply = false }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return
    setIsSubmitting(true)
    try {
      await onReply(comment.id, replyContent)
      setReplyContent('')
      setShowReplyInput(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`${isReply ? 'ml-8 pl-4 border-l-2 border-[rgba(0,0,0,0.05)]' : ''}`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-[#f6f5f4] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {comment.author.avatar ? (
            <Image
              src={comment.author.avatar}
              alt={comment.author.username}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <User className="w-4 h-4 text-[#a39e98]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-[rgba(0,0,0,0.95)]">
              {comment.author.username}
            </span>
            <span className="text-xs text-[#a39e98]">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-[#615d59] whitespace-pre-wrap break-words">
            {comment.content}
          </p>
          <div className="flex items-center gap-4 mt-2">
            {!isReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1 text-xs text-[#a39e98] hover:text-notion-blue transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                回复
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="写下你的回复..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  loading={isSubmitting}
                  disabled={!replyContent.trim()}
                >
                  发布回复
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowReplyInput(false)
                    setReplyContent('')
                  }}
                >
                  取消
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
