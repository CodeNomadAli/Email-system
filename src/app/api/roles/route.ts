import type { NextRequest } from 'next/server'

import { apiResponse, catchErrors, getAuthUser } from '@/utils/backend-helper'
import prisma from '@/db'

export async function GET() {
  try {
    const userSession = await getAuthUser()

    if (!userSession) {
      throw new Error('User not found')
    }

    const roles = await prisma.roles.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        users: {
          include: {
            user: true
          }
        },
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return apiResponse(roles, 'Roles fetched successfully')
  } catch (error) {
    return catchErrors(error as Error, 'Error getting roles')
  }
}

export async function POST(req: NextRequest) {
  try {
    const userSession = await getAuthUser()

    if (!userSession) {
      throw new Error('User not found')
    }

    const formData = await req.formData()
    const name = formData.get('name') as string
    const permissions = formData.get('permissions') as string
    const isDefault = formData.get('isDefault') === 'true'
    const permissionsArray = permissions.split(',').map(permission => permission.trim())

    const role = await prisma.roles.create({
      data: {
        name,
        isDefault: isDefault
      }
    })

    const existingPermissions = await prisma.permission.findMany({
      where: {
        name: {
          in: permissionsArray
        }
      }
    })

    if (existingPermissions.length !== permissionsArray.length) {
      return catchErrors(new Error('Invalid permissions'), 'Invalid permissions')
    }

    const rolePermissions = permissionsArray.map(permission => {
      const permissionId = existingPermissions.find(p => p.name === permission)!.id

      return {
        roleId: role.id,
        permissionId
      }
    })

    await prisma.rolesOnPermissions.createMany({
      data: rolePermissions
    })

    return apiResponse(role, 'Role created successfully')
  } catch (error) {
    return catchErrors(error as Error, 'Error creating role')
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userSession = await getAuthUser()

    if (!userSession) {
      throw new Error('User not found')
    }

    const formData = await req.formData()
    const name = formData.get('name') as string
    const permissions = formData.get('permissions') as string
    const isDefault = formData.get('isDefault') === 'true'

    const permissionsArray = permissions.split(',').map(permission => permission.trim())

    const existingRole = await prisma.roles.findFirst({
      where: { name }
    })

    if (!existingRole) {
      throw new Error("Role doesn't exist")
    }

    const existingPermissions = await prisma.permission.findMany({
      where: {
        name: {
          in: permissionsArray
        }
      }
    })

    if (existingPermissions.length !== permissionsArray.length) {
      return catchErrors(new Error('Invalid permissions'), 'Invalid permissions')
    }

    const role = await prisma.roles.update({
      where: { id: existingRole.id },
      data: {
        name,
        isDefault: isDefault
      }
    })

    await prisma.rolesOnPermissions.deleteMany({
      where: {
        roleId: role.id
      }
    })

    const rolePermissions = permissionsArray.map(permission => {
      const permissionId = existingPermissions.find(p => p.name === permission)!.id

      return {
        roleId: role.id,
        permissionId
      }
    })

    await prisma.rolesOnPermissions.createMany({
      data: rolePermissions
    })

    return apiResponse(role, 'Role updated successfully')
  } catch (error) {
    return catchErrors(error as Error, 'Error updating role')
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const roleId = params.get('roleId')

    if (!roleId) {
      return catchErrors(new Error('Role ID is required'), 'Invalid request', 400)
    }

    const [roleInPermissions, roleInUserRole] = await Promise.all([
      prisma.rolesOnPermissions.count({ where: { roleId } }),
      prisma.userRole.count({ where: { roleId } })
    ])

    if (roleInUserRole > 0) throw new Error('Role is linked to user table and cannot be deleted')

    if (roleInPermissions > 0) {
      await prisma.rolesOnPermissions.deleteMany({
        where: { roleId }
      })
    }

    const deletedRole = await prisma.roles.delete({
      where: { id: roleId }
    })

    return apiResponse({ deletedRole }, 'Role deleted successfully')
  } catch (error) {
    console.error(error)

    return catchErrors(error as Error, (error as Error).message || 'Failed to delete role')
  }
}
