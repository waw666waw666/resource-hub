import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        avatar: true,
        createdAt: true,
        resources: {
          where: { deleted: false },
          orderBy: { createdAt: 'desc' },
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
        },
      },
    })

    if (!user) {
      return NextResponse.json(errorResponse('用户不存在'), { status: 404 })
    }

    const profile = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      createdAt: user.createdAt,
    }

    const resources = user.resources.map((r) => ({
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

    return NextResponse.json(successResponse({ profile, resources }))
  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(errorResponse('获取用户信息失败'), { status: 500 })
  }
}
