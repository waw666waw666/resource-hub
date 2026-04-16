'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const variants = {
    primary: 'bg-notion-blue text-white hover:bg-notion-blue-hover focus:ring-notion-blue',
    secondary: 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.95)] hover:bg-[rgba(0,0,0,0.08)] focus:ring-[rgba(0,0,0,0.1)]',
    ghost: 'bg-transparent text-[rgba(0,0,0,0.95)] hover:bg-[rgba(0,0,0,0.05)] focus:ring-[rgba(0,0,0,0.1)]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  )
}
