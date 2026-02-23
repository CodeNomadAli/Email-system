import { NextResponse } from 'next/server'

import prisma from '@/db'

import { getAuthUser } from '@/utils/backend-helper'
// import { getAuthSession } from '@/helper'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { emailIds }: { emailIds: number[] } = body

    const user = await getAuthUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!emailIds?.length) {
      return NextResponse.json({ error: 'No email IDs provided' }, { status: 400 })
    }

    // ✅ Check if ALL emails belong to this user
    const emails = await prisma.email.findMany({
      where: {
        uid: { in: emailIds }
      },
      select: { userId: true }
    })

    const notOwned = emails.some(email => email.userId !== user.id)

    if (notOwned || emails.length !== emailIds.length) {
      return NextResponse.json(
        { error: 'Only owner can delete this email' },
        { status: 403 }
      )
    }

    // ✅ Safe to delete
    const result = await prisma.email.updateMany({
      where: {
        uid: { in: emailIds },
        userId: user.id
      },
      data: {
        deletedAt: true,
        folder: 'trash'
      }
    })

    return NextResponse.json({
      success: true,
      updatedCount: result.count
    })
  } catch (err) {
    console.error(err)
    
return NextResponse.json({ error: 'Failed to delete emails' }, { status: 500 })
  }
}





export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const folder  = searchParams.get('folder') || 'trash'
    const search  = searchParams.get('search') || ''
    const page    = Number(searchParams.get('page')) || 1
    const perPage = 20
    const user = await getAuthUser()

    const where: any = {
      folder,
      userId:user?.id,
      deletedAt: true, // ✅ only deleted emails
      OR: search
        ? [
            { subject: { contains: search, mode: 'insensitive' } },
            { fromEmail: { contains: search, mode: 'insensitive' } },
            { fromName: { contains: search, mode: 'insensitive' } }
          ]
        : undefined
    }

    const [emails, total] = await Promise.all([
      prisma.email.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: { attachments: true }
      }),
      prisma.email.count({ where })
    ])

    return NextResponse.json({
      emails,
      total,
      page,
      pages: Math.ceil(total / perPage)
    })
  } catch (err) {
    console.error(err)
    
return NextResponse.json({ error: 'Failed to fetch deleted emails' }, { status: 500 })
  }
}
