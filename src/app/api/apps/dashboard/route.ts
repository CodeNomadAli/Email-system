// app/api/apps/dashboard/route.ts
import { NextResponse } from 'next/server'

import prisma from '@/db'
import { getAuthUser } from '@/utils/backend-helper'

export async function GET() {
  const authUser = await getAuthUser()

  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch user roles
    const userWithRoles = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { roles: { include: { role: true } } }
    })

    const isAdmin = userWithRoles?.roles.some(
      r => ['admin', 'super-admin'].includes(r.role.name.toLowerCase())
    )

    if (isAdmin) {
      // --------------------------
      // Super-admin summary cards
      // --------------------------
      const [totalUsers, totalEmails] = await Promise.all([
        prisma.user.count(),
        prisma.email.count({ where: { deletedAt: false } })
      ])

      // --------------------------
      // Table: only emails assigned to someone
      // --------------------------
      const latestEmails = await prisma.email.findMany({
        where: {
          deletedAt: false,
          assignments: { some: {} } // must have at least 1 assignment
        },
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
          assignments: {
            include: {
              user: { select: { first_name: true, last_name: true, email: true } }
            }
          }
        }
      })

      const latestNotifications = await prisma.notifications.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        stats: { totalUsers, totalEmails },
        latestEmails,
        latestNotifications
      })
    }

    // --------------------------
    // Normal user: only assigned emails
    // --------------------------
    const [myAssignedCount, myEmails, myNotifications] = await Promise.all([
      prisma.userEmailAssignment.count({ where: { userId: authUser.id } }),
      prisma.email.findMany({
        where: {
          deletedAt: false,
          assignments: { some: { userId: authUser.id } }
        },
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
          assignments: {
            where: { userId: authUser.id },
            include: {
              user: { select: { first_name: true, last_name: true, email: true } }
            }
          }
        }
      }),
      prisma.notifications.findMany({
        where: { user_id: authUser.id },
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ])

    return NextResponse.json({
      stats: { myAssignedEmails: myAssignedCount },
      latestEmails: myEmails,
      latestNotifications: myNotifications
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    
return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
