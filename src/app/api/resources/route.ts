import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'latest'

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {
      deleted: false,
    }

    if (tag) {
      where.tags = { has: tag }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy: Record<string, string> = {}
    switch (sort) {
      case 'popular':
        orderBy.createdAt = 'desc'
        break
      case 'oldest':
        orderBy.createdAt = 'asc'
        break
      default:
        orderBy.createdAt = 'desc'
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      prisma.resource.count({ where }),
    ])

    const formattedResources = resources.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      coverImage: r.coverImage,
      tags: r.tags,
      author: r.author,
      likesCount: r._count.likes,
      commentsCount: r._count.comments,
      createdAt: r.createdAt,
    }))

    return NextResponse.json(successResponse({
      resources: formattedResources,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }))
  } catch (error) {
    console.error('Get resources error:', error)
    return NextResponse.json(errorResponse('获取资源列表失败'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(errorResponse('请先登录'), { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, coverImage, tags } = body

    if (!title || !content) {
      return NextResponse.json(errorResponse('标题和内容不能为空'), { status: 400 })
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || '',
        content,
        coverImage: coverImage || null,
        tags: tags || [],
        authorId: session.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(successResponse(resource), { status: 201 })
  } catch (error) {
    console.error('Create resource error:', error)
    return NextResponse.json(errorResponse('创建资源失败'), { status: 500 })
  }
}
