import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password } = body

    if (!email || !username || !password) {
      return NextResponse.json(errorResponse('请填写所有必填字段'), { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(errorResponse('密码至少需要6个字符'), { status: 400 })
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json(errorResponse('该邮箱已被注册'), { status: 409 })
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername) {
      return NextResponse.json(errorResponse('该用户名已被使用'), { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    })

    const token = await createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    await setAuthCookie(token)

    return NextResponse.json(successResponse(user), { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(errorResponse('注册失败，请稍后重试'), { status: 500 })
  }
}
