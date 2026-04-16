'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.85)] animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-card-lg shadow-card-hover p-6 w-full max-w-md mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.95)]">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors"
          >
            <X className="w-5 h-5 text-[#615d59]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
