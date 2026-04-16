'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 text-base border rounded bg-white text-[rgba(0,0,0,0.9)] placeholder-[#a39e98] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-notion-blue focus:border-transparent ${error ? 'border-red-500' : 'border-[#dddddd]'} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[rgba(0,0,0,0.95)] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full px-3 py-2 text-base border rounded bg-white text-[rgba(0,0,0,0.9)] placeholder-[#a39e98] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-notion-blue focus:border-transparent resize-none ${error ? 'border-red-500' : 'border-[#dddddd]'} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
