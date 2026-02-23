import type { NextRequest } from 'next/server'

import { apiResponse, catchErrors, getAuthUser } from '@/utils/backend-helper'
import prisma from '@/db'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    const formParams = req.nextUrl.searchParams
    const roleId = formParams.get('roleId')

    if (!user) {
      throw new Error('User not found')
    }

    if (roleId) {
      const role = await prisma.roles.findUnique({
        where: {
          id: roleId
        },
        include: {
          permissions: true
        }
      })

      if (role) {
        return apiResponse(role, 'Role fetched successfully')
      }
    }

    const permissions = await prisma.permission.findMany()

    return apiResponse(permissions, 'Permissions fetched successfully')
  } catch (error) {
    return catchErrors(error as Error, 'Error getting roles')
  }
}
