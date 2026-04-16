import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const resource = await prisma.resource.findUnique({
      where: { id, deleted: false },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            createdAt: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!resource) {
      return NextResponse.json(errorResponse('资源不存在'), { status: 404 })
    }

    const session = await getSession()
    const userLiked = session
      ? resource.likes.some((like) => like.userId === session.userId)
      : false

    return NextResponse.json(successResponse({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      content: resource.content,
      coverImage: resource.coverImage,
      tags: resource.tags,
      author: resource.author,
      likesCount: resource._count.likes,
      commentsCount: resource._count.comments,
      userLiked,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    }))
  } catch (error) {
    console.error('Get resource error:', error)
    return NextResponse.json(errorResponse('获取资源详情失败'), { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(errorResponse('请先登录'), { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.resource.findUnique({
      where: { id, deleted: false },
    })

    if (!existing) {
      return NextResponse.json(errorResponse('资源不存在'), { status: 404 })
    }

    if (existing.authorId !== session.userId) {
      return NextResponse.json(errorResponse('无权修改此资源'), { status: 403 })
    }

    const body = await request.json()
    const { title, description, content, coverImage, tags } = body

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        title: title || existing.title,
        description: description ?? existing.description,
        content: content || existing.content,
        coverImage: coverImage ?? existing.coverImage,
        tags: tags || existing.tags,
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

    return NextResponse.json(successResponse(resource))
  } catch (error) {
    console.error('Update resource error:', error)
    return NextResponse.json(errorResponse('更新资源失败'), { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(errorResponse('请先登录'), { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.resource.findUnique({
      where: { id, deleted: false },
    })

    if (!existing) {
      return NextResponse.json(errorResponse('资源不存在'), { status: 404 })
    }

    if (existing.authorId !== session.userId) {
      return NextResponse.json(errorResponse('无权删除此资源'), { status: 403 })
    }

    await prisma.resource.update({
      where: { id },
      data: { deleted: true },
    })

    return NextResponse.json(successResponse({ message: '删除成功' }))
  } catch (error) {
    console.error('Delete resource error:', error)
    return NextResponse.json(errorResponse('删除资源失败'), { status: 500 })
  }
}
