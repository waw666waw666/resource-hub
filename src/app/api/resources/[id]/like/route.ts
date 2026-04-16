import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

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

    const resource = await prisma.resource.findUnique({
      where: { id, deleted: false },
    })

    if (!resource) {
      return NextResponse.json(errorResponse('资源不存在'), { status: 404 })
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_resourceId: {
          userId: session.userId,
          resourceId: id,
        },
      },
    })

    let liked: boolean
    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      liked = false
    } else {
      await prisma.like.create({
        data: {
          userId: session.userId,
          resourceId: id,
        },
      })
      liked = true
    }

    const likesCount = await prisma.like.count({
      where: { resourceId: id },
    })

    return NextResponse.json(successResponse({ liked, likesCount }))
  } catch (error) {
    console.error('Toggle like error:', error)
    return NextResponse.json(errorResponse('操作失败'), { status: 500 })
  }
}
