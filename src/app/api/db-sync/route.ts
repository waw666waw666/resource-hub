import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    await prisma.$connect()
    
    await prisma.user.create({
      data: {
        email: 'demo@example.com',
        username: 'demo',
        password: 'demo123',
      },
    })

    return NextResponse.json({ success: true, message: 'Database synced!' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await prisma.user.findMany()
    return NextResponse.json({ success: true, message: 'Database connected!' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
