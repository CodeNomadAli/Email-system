// lib/fetchUsers.ts
import type { User } from '@prisma/client'

import prisma from '@/db'


export interface UserResponse {
  users: User[]
  totalRecords: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: booleanp
}

export async function fetchUsers(page: number, pageSize: number, managerId: string): Promise<UserResponse> {
  const totalRecords = await prisma.user.count({
    where: {
      managerId: managerId // Only users managed by this manager
    }
  })

  const totalPages = Math.ceil(totalRecords / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const users = await prisma.user.findMany({
    where: {
      managerId: managerId // Only users managed by this manager
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
    include: {
      roles: {
        include: {
          role: true
        }
      }
    }
  })

  return {
    users,
    totalRecords,
    totalPages,
    hasNextPage,
    hasPrevPage
  }
}
