import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[rgba(0,0,0,0.1)] bg-[#f6f5f4]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-notion-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-sm text-[#615d59]">
              ResourceHub - 资源分享平台
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#a39e98]">
            <Link href="/" className="hover:text-[#615d59] transition-colors">
              首页
            </Link>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#615d59] transition-colors"
            >
              Powered by Vercel
            </a>
            <a
              href="https://neon.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#615d59] transition-colors"
            >
              Database by Neon
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.05)] text-center">
          <p className="text-xs text-[#a39e98]">
            2024 ResourceHub. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  )
}
