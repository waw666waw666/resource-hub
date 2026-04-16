'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ResourceCard } from '@/components/ResourceCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, Plus, Sparkles } from 'lucide-react'
import { Resource, PaginatedResources } from '@/types'

export default function HomePage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const fetchResources = async (pageNum: number = 1, searchQuery: string = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '9',
      })
      if (searchQuery) {
        params.set('search', searchQuery)
      }

      const res = await fetch(`/api/resources?${params}`)
      const data = await res.json()

      if (data.success) {
        const result = data.data as PaginatedResources
        setResources(pageNum === 1 ? result.resources : [...resources, ...result.resources])
        setTotalPages(result.totalPages)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Fetch resources error:', error)
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    fetchResources(1, search)
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-[#f6f5f4] to-white py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[rgba(0,0,0,0.1)] shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-notion-blue" />
              <span className="text-sm font-medium text-[#615d59]">发现精彩资源</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[rgba(0,0,0,0.95)] tracking-tight mb-4">
              分享知识，发现价值
            </h1>
            <p className="text-lg text-[#615d59] max-w-2xl mx-auto mb-8">
              在这里，你可以发现来自社区的优质资源，也可以分享你的知识和经验
            </p>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a39e98]" />
                <input
                  type="text"
                  placeholder="搜索资源..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 text-base border border-[rgba(0,0,0,0.1)] rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-notion-blue focus:border-transparent transition-all"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6"
                  loading={isSearching}
                >
                  搜索
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[rgba(0,0,0,0.95)]">最新资源</h2>
            <a href="/create">
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                发布资源
              </Button>
            </a>
          </div>

          {loading && resources.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-card border border-[rgba(0,0,0,0.1)] p-4 animate-pulse">
                  <div className="h-40 bg-[#f6f5f4] rounded-lg mb-4" />
                  <div className="h-6 bg-[#f6f5f4] rounded mb-2" />
                  <div className="h-4 bg-[#f6f5f4] rounded w-2/3 mb-4" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-[#f6f5f4] rounded w-1/4" />
                    <div className="h-4 bg-[#f6f5f4] rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#615d59] mb-4">还没有资源，成为第一个分享者吧！</p>
              <a href="/create">
                <Button>发布第一个资源</Button>
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {page < totalPages && (
                <div className="text-center mt-12">
                  <Button
                    variant="secondary"
                    onClick={() => fetchResources(page + 1, search)}
                    loading={loading}
                  >
                    加载更多
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
