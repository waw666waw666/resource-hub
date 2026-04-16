import { NextResponse } from 'next/server'
import { getSession, clearAuthCookie } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(errorResponse('未登录'), { status: 401 })
    }
    return NextResponse.json(successResponse(session))
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(errorResponse('获取会话失败'), { status: 500 })
  }
}
