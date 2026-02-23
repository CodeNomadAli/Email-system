import { NextResponse } from 'next/server'

import prisma from '@/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { emailIds }: { emailIds: number[] } = body

    if (!emailIds?.length) {
      return NextResponse.json({ error: 'No email IDs provided' }, { status: 400 })
    }

    // Permanent delete from database
    const result = await prisma.email.deleteMany({
      where: { uid: { in: emailIds } }
    })

    return NextResponse.json({ success: true, deletedCount: result.count })
  } catch (err) {
    console.error(err)
    
return NextResponse.json({ error: 'Failed to permanently delete emails' }, { status: 500 })
  }
}
