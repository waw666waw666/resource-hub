import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(errorResponse('请填写邮箱和密码'), { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        avatar: true,
      },
    })

    if (!user) {
      return NextResponse.json(errorResponse('邮箱或密码错误'), { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(errorResponse('邮箱或密码错误'), { status: 401 })
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    await setAuthCookie(token)

    return NextResponse.json(successResponse({
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    }))
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(errorResponse('登录失败，请稍后重试'), { status: 500 })
  }
}
