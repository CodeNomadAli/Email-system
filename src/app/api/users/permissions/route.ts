import type { NextRequest } from 'next/server'

import { catchErrors, getAuthUser, apiResponse } from '@/utils/backend-helper'
import prisma from '@/db'

interface Role {
  role: {
    permissions: LocalPermission[]
  }
}

interface LocalPermission {
  permission: {
    name: string
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const userId = params.get('userId')
    const userEmail = params.get('userEmail')
    const authUser = params.get('authUser')
    const userSession = await getAuthUser()

    if (!userSession) {
      throw new Error('User not found')
    }

    const withModels = {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: withModels
      })

      return apiResponse({ user }, 'User fetched successfully')
    }

    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: withModels
      })

      return apiResponse({ user }, 'User fetched successfully')
    }

    if (authUser) {
      const user = await prisma.user.findUnique({
        where: { id: userSession.id },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      const permissions = user ? plainPermissions(user.roles) : []

      return apiResponse({ user, permissions }, 'User fetched successfully')
    }

    const users = await prisma.user.findMany({
      include: withModels
    })

    return apiResponse({ users }, 'Users fetched successfully')
  } catch (error) {
    return catchErrors(error as Error, 'Error getting users')
  }
}

const plainPermissions = (roles: Role[]) => {
  try {
    const permissions = roles.map((role: Role) => role.role).flat()

    const permissionNames: string[] = permissions
      .map((permission: { permissions: LocalPermission[] }) =>
        permission.permissions.map((p: LocalPermission) => p.permission.name)
      )
      .flat()

    return permissionNames
  } catch (error) {
    console.info(error)
  }
}
