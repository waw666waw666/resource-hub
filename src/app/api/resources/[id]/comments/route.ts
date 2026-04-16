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

    const comments = await prisma.comment.findMany({
      where: {
        resourceId: id,
        parentId: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(successResponse(comments))
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(errorResponse('获取评论失败'), { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(errorResponse('请先登录'), { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { content, parentId } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(errorResponse('评论内容不能为空'), { status: 400 })
    }

    const resource = await prisma.resource.findUnique({
      where: { id, deleted: false },
    })

    if (!resource) {
      return NextResponse.json(errorResponse('资源不存在'), { status: 404 })
    }

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      })
      if (!parentComment || parentComment.resourceId !== id) {
        return NextResponse.json(errorResponse('无效的父评论'), { status: 400 })
      }
      if (parentComment.parentId) {
        return NextResponse.json(errorResponse('回复层级不能超过2层'), { status: 400 })
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: session.userId,
        resourceId: id,
        parentId: parentId || null,
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

    return NextResponse.json(successResponse(comment), { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(errorResponse('添加评论失败'), { status: 500 })
  }
}
