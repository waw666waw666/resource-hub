import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'
import { successResponse } from '@/lib/api'

export async function POST() {
  try {
    await clearAuthCookie()
    return NextResponse.json(successResponse({ message: '登出成功' }))
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: false, error: '登出失败' }, { status: 500 })
  }
}
