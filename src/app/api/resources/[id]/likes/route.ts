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

    const likesCount = await prisma.like.count({
      where: { resourceId: id },
    })

    const session = await getSession()
    const userLiked = session
      ? await prisma.like.findUnique({
          where: {
            userId_resourceId: {
              userId: session.userId,
              resourceId: id,
            },
          },
        })
      : null

    return NextResponse.json(successResponse({
      likesCount,
      userLiked: !!userLiked,
    }))
  } catch (error) {
    console.error('Get likes error:', error)
    return NextResponse.json(errorResponse('获取点赞信息失败'), { status: 500 })
  }
}
