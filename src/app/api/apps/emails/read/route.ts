// app/api/emails/read/route.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import prisma from '@/db'
import { getAuthUser } from '@/utils/backend-helper'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 })
    }

    const body = await req.json()
    const { ids } = body as { ids: number[] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: 'Email IDs are required', success: false }, { status: 400 })
    }

    const isSuperAdmin = user.email === 'superadmin@gmail.com'
    let updatedCount = 0

    if (isSuperAdmin) {
      // Super admin: update the email directly
      const updated = await prisma.email.updateMany({
        where: { uid: { in: ids } },
        data: { isRead: true }
      })

      updatedCount = updated.count
    } else {
      // Non-admin: update the userEmailAssignment for this user
      const updated = await prisma.userEmailAssignment.updateMany({
        where: {
          userId: user.id,
          uid: { in: ids }// convert to string to match schema
        },
        data: { isRead: true }
      })

      updatedCount = updated.count
    }

    return NextResponse.json({
      message: 'Emails marked as read',
      success: true,
      updatedCount
    })
  } catch (err) {
    console.error('Mark as read error:', err)
    
return NextResponse.json({ message: 'Failed to update emails', success: false }, { status: 500 })
  }
}
