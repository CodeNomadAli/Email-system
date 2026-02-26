// app/api/emails/route.ts

import { NextResponse } from 'next/server'
import { getAuthUser } from '@/utils/backend-helper'
import prisma from '@/db'

export async function GET(request: Request) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isSuperAdmin = user.email === 'superadmin@gmail.com'

    const { searchParams } = new URL(request.url)

    const folder = searchParams.get('folder') || 'inbox'
    const search = searchParams.get('search') || ''
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const perPage = 20

    // 🔹 Base filters
    const baseWhere: any = {
      folder,
      deletedAt: false,
      OR: [
        { subject: { not: null } },
        { body: { not: null } },
        { htmlBody: { not: null } },
        { fromName: { not: null } },
        { fromEmail: { not: null } }
      ]
    }

    let where: any = baseWhere
    let userAssignments: Record<string, { isRead: boolean }> = {}

    // 🔹 Restrict emails for normal users
    if (!isSuperAdmin) {
      const assigned = await prisma.userEmailAssignment.findMany({
        where: { userId: user.id },
        select: { email: true, isRead: true }
      })

      const assignedEmails = assigned
        .map(a => a.email)
        .filter(Boolean)

      if (assignedEmails.length === 0) {
        return NextResponse.json({
          emails: [],
          total: 0,
          page,
          pages: 0
        })
      }

      // IMPORTANT: Use AND to strictly limit access
      where = {
        AND: [
          baseWhere,
          {
            OR: [
              { to: { in: assignedEmails } },
              { fromEmail: { in: assignedEmails } }
            ]
          }
        ]
      }

      userAssignments = Object.fromEntries(
        assigned.map(a => [a.email!, { isRead: a.isRead }])
      )
    }

    // 🔹 Search filter
    if (search) {
      const searchFilter = {
        OR: [
          { subject: { contains: search } },
          { fromEmail: { contains: search } },
          { fromName: { contains: search } },
          { body: { contains: search } },
          { htmlBody: { contains: search } }
        ]
      }

      where = {
        AND: [where, searchFilter]
      }
    }

    // 🔹 Fetch emails + count
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

    // 🔹 Override isRead for assigned users
    const finalEmails = emails.map(email => {
      if (isSuperAdmin) return email

      const assignedKey =
        userAssignments[email.to ?? ''] ||
        userAssignments[email.fromEmail ?? '']

      return assignedKey
        ? { ...email, isRead: assignedKey.isRead }
        : email
    })

    return NextResponse.json({
      emails: finalEmails,
      total,
      page,
      pages: Math.ceil(total / perPage)
    })
  } catch (error) {
    console.error('Email API error:', error)

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
